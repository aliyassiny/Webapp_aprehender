import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reports')
@UseGuards(RolesGuard)
@Roles(Role.COORDINATOR)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('generate')
  generateReport(@Query() dto: GenerateReportDto) {
    return this.reportsService.generateReport(dto);
  }
}
