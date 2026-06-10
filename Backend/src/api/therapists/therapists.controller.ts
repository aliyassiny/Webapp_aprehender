import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { AddPatientDto } from './dto/add-patient';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { TherapistsPipe } from './pipes/therapits.pipe';
import { TherapistIdPipe } from './pipes/therapist-id.pipe';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('therapists')
@UseGuards(RolesGuard, ThrottlerGuard)
@Roles(Role.THERAPIST,Role.COORDINATOR)
@Throttle( { default: {ttl: 60000, limit: 100}})
export class TherapistsController {
  constructor(private readonly therapistsService: TherapistsService) {}

  @Post('patients')
  addPatient(@Body(TherapistsPipe) addPatientDto: AddPatientDto) {
    return this.therapistsService.addPatient(addPatientDto);
  }

  @Get(':id')
  getTherapist(@Param('id', TherapistIdPipe) id: string) {
    return this.therapistsService.getTherapist(id);
  }

  @Patch(':id')
  updateTherapist(@Param('id', TherapistIdPipe) id: string, @Body() dto: UpdateTherapistDto) {
    return this.therapistsService.updateTherapist(id, dto);
  }

  @Get(':id/patients')
  getTherapistPatients(@Param('id') id: string) {
    return this.therapistsService.getTherapistPatients(id);
  }

  @Get(':id/sessions')
  getTherapistSessions(@Param('id') id: string) {
    return this.therapistsService.getTherapistSessions(id);
  }

  @Get(':id/clinical-notes')
  getTherapistClinicalNotes(@Param('id') id: string) {
    return this.therapistsService.getTherapistClinicalNotes(id);
  }
}
