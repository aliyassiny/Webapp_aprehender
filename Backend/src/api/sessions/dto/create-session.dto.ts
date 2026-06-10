import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { SessionStatus } from '@prisma/client';

class CreateSessionNoteDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  therapistId: string;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @IsNotEmpty()
  @IsString()
  meetingLink: string;

  @IsNotEmpty()
  @IsEnum(SessionStatus)
  status: SessionStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionNoteDto)
  notes?: CreateSessionNoteDto[]

  @IsNotEmpty()
  @IsBoolean()
  isVirtual: boolean;
}
