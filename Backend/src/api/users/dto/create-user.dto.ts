import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  isActive: boolean;

  // CreateUserDto
  therapistProfile?: { specialization?: string };
  patientProfile?: { dateOfBirth?: Date; phone?: string };
}
