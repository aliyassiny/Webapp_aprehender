import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

/** Campos que devolvemos al cliente (nunca la contraseña). */
const userPublicSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const password = await this.hashPassword(createUserDto.password);

    const role = createUserDto.role;
    const username =
      createUserDto.username ||
      createUserDto.email.split('@')[0].toLowerCase();

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username,
        password,
        role,
        isActive: createUserDto.isActive,
        patientProfile:
          role === Role.PATIENT ? { create: {} } : undefined,
          therapistProfile:
          role === Role.THERAPIST
            ? { create: { specialization: createUserDto.therapistProfile?.specialization } }
            : undefined,
      },
      select: userPublicSelect,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: userPublicSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data: Prisma.UserUpdateInput = {};

    if (updateUserDto.email !== undefined) {
      data.email = updateUserDto.email;
    }
    if (updateUserDto.role !== undefined) {
      data.role = updateUserDto.role;
    }
    if (updateUserDto.isActive !== undefined) {
      data.isActive = updateUserDto.isActive;
    }
    if (updateUserDto.password !== undefined) {
      data.password = await this.hashPassword(updateUserDto.password);
    }

    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userPublicSelect,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('El email ya está en uso');
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
      select: userPublicSelect,
    });
  }
}
