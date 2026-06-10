import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  therapistId?: string;

  @IsOptional()
  @IsString()
  patientId?: string;
}
