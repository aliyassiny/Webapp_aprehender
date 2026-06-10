import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PatientsPipe } from './pipes/patients.pipe';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('patients')
@UseGuards(RolesGuard, ThrottlerGuard)
@Roles(Role.PATIENT, Role.COORDINATOR)
@Throttle( { default: {ttl: 60000, limit: 100}})
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // :id recibe userId → PatientsPipe lo convierte a profileId
  @Get(':id')
  getPatient(@Param('id', PatientsPipe) id: string) {
    return this.patientsService.getPatient(id);
  }

  @Patch(':id')
  @Roles(Role.PATIENT)
  updatePatient(@Param('id', PatientsPipe) id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.updatePatient(id, dto);
  }

  @Get(':id/clinical-notes')
  getClinicalNotes(@Param('id', PatientsPipe) id: string) {
    return this.patientsService.getClinicalNotes(id);
  }

  @Get(':id/sessions')
  getSessions(@Param('id', PatientsPipe) id: string) {
    return this.patientsService.getSessions(id);
  }

  @Get(':id/therapists')
  getTherapists(@Param('id', PatientsPipe) id: string) {
    return this.patientsService.getTherapists(id);
  }
}
