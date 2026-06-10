import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClinicalNotesService } from './clinical-notes.service';
import { CreateClinicalNoteDto } from './dto/create-clinical-note.dto';
import { UpdateClinicalNoteDto } from './dto/update-clinical-note.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('clinical-notes')
@UseGuards(RolesGuard, ThrottlerGuard)
@Roles(Role.THERAPIST)
@Throttle( { default: {ttl: 60000, limit: 100}})
export class ClinicalNotesController {
  constructor(private readonly clinicalNotesService: ClinicalNotesService) {}

  @Post()
  createNote(@Body() createClinicalNoteDto: CreateClinicalNoteDto) {
    return this.clinicalNotesService.create(createClinicalNoteDto);
  }

  @Get('patient/:patientId')
  getByPatient(@Param('patientId') patientId: string) {
    return this.clinicalNotesService.findByPatient(patientId);
  }

  @Get(':id')
  getNote(@Param('id') id: string) {
    return this.clinicalNotesService.findOne(id);
  }

  @Patch(':id')
  updateNote(@Param('id') id: string, @Body() updateClinicalNoteDto: UpdateClinicalNoteDto) {
    return this.clinicalNotesService.update(id, updateClinicalNoteDto);
  }

  @Delete(':id')
  removeNote(@Param('id') id: string) {
    return this.clinicalNotesService.remove(id);
  }
}
