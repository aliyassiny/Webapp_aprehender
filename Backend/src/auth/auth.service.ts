import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LoginDto } from './dto/login';
import { RegisterDto } from './dto/register';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto } from './dto/refresh-token';
import { LogoutDto } from './dto/logout';
import { JwtService } from './utils/jwt_generated';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    private readonly jwtSecret = process.env.JWT_SECRET ?? '';
    private readonly jwtRefreshSecret =
      process.env.JWT_REFRESH_SECRET ?? this.jwtSecret;

    constructor(
      private readonly prisma: PrismaService,
      private readonly jwtService: JwtService,
    ) {}

    

    async hashPassword(password : string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }


    async register( data : RegisterDto) {
        const handlePassword = await this.hashPassword(data.password)
        const user = await this.prisma.user.create({
            data : { email: data.email, password: handlePassword, username: data.username }
        });

        const accessToken = await this.jwtService.generateAccessToken(
          user.id,
          user.role,
        );
        const refreshToken = await this.jwtService.generateAndStoreRefreshToken(
          user.id,
        );
        if (user.role === Role.PATIENT) {
          await this.prisma.patientProfile.create({
            data: {
              userId: user.id,
            },
          });
        }
        return { user, accessToken, refreshToken };
    }

    async login(data : LoginDto): Promise<{ accessToken: string; refreshToken: string; data_user: {} }> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const data_user = { id: user.id, username: user.username, email: user.email, role: user.role, isActive: user.isActive}
        const accessToken = await this.jwtService.generateAccessToken(
          user.id,
          user.role,
        );
        const refreshToken = await this.jwtService.generateAndStoreRefreshToken(
          user.id,
        );
        return { accessToken, refreshToken, data_user };
    }

    async refresh(data: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
        try {
          const payload = jwt.verify(
            data.refreshToken,
            this.jwtRefreshSecret,
          ) as jwt.JwtPayload;

          if (payload.type !== 'refresh' || !payload.jti || !payload.userId) {
            throw new UnauthorizedException('Invalid refresh token');
          }

          const stored = await this.prisma.refreshToken.findFirst({
            where: {
              jti: String(payload.jti),
              tokenHash: this.jwtService.hashToken(data.refreshToken),
              revoked: false,
            },
          });

          if (!stored || stored.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token expired or revoked');
          }

          await this.prisma.refreshToken.update({
            where: { id: stored.id },
            data: { revoked: true },
          });

          const user = await this.prisma.user.findUnique({
            where: { id: String(payload.userId) },
          });
          if (!user) {
            throw new UnauthorizedException('User not found');
          }

          const accessToken = await this.jwtService.generateAccessToken(
            user.id,
            user.role,
          );
          const refreshToken = await this.jwtService.generateAndStoreRefreshToken(
            user.id,
          );

          return { accessToken, refreshToken };
        } catch (error) {
          throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(accessToken: string, data: LogoutDto): Promise<{ message: string }> {
        await this.jwtService.blacklistAccessToken(accessToken, 'logout');

        if (data.refreshToken) {
          await this.jwtService.revokeRefreshToken(data.refreshToken);
        }

        return { message: 'Logout successful' };
    }
    
    async validateToken(token: string): Promise<any> {
        try {
            const payload = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
            if (payload.type !== 'access' || !payload.jti || !payload.role) {
              throw new UnauthorizedException('Invalid token type');
            }

            const blacklisted = await this.prisma.blacklistedToken.findUnique({
              where: { jti: String(payload.jti) },
            });
            if (blacklisted && blacklisted.expiresAt > new Date()) {
              throw new UnauthorizedException('Token blacklisted');
            }

            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
    
    
}