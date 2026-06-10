import { Module } from "@nestjs/common";
import { UsersModule } from "src/api/users/users.module";
import { PrismaService } from "src/database/prisma.service";
import { AuthController } from "src/auth/auth.controller"
import { AuthService } from "src/auth/auth.service"
import { JwtService } from "src/auth/utils/jwt_generated";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}