import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateClinicalNoteDto } from './dto/create-clinical-note.dto';
import { UpdateClinicalNoteDto } from './dto/update-clinical-note.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClinicalNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClinicalNoteDto: CreateClinicalNoteDto) {
    const therapistProfile = await this.prisma.therapistProfile.findUnique({
      where: { userId: createClinicalNoteDto.therapistId }
    });

    if (!therapistProfile) {
      throw new BadRequestException("No se encontró el perfil del terapeuta");
    }

    const data: Prisma.ClinicalNoteUncheckedCreateInput = {
      therapistId: therapistProfile.id,
      patientId: createClinicalNoteDto.patientId,
      content: createClinicalNoteDto.content,
      sessionId: createClinicalNoteDto.sessionId || (undefined as unknown as string),
    };
    return this.prisma.clinicalNote.create({ data });
  }

  findOne(id: string) {
    return this.prisma.clinicalNote.findUnique({
      where: { id },
      include: {
        therapist: { include: { user: { select: { username: true } } } },
        session: { select: { id: true, startTime: true } },
      },
    });
  }

  findByPatient(patientId: string) {
    return this.prisma.clinicalNote.findMany({
      where: { patientId },
      include: {
        therapist: { include: { user: { select: { username: true } } } },
        session: { select: { id: true, startTime: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateClinicalNoteDto: UpdateClinicalNoteDto) {
    await this.findOne(id);

    const data: Prisma.ClinicalNoteUpdateInput = {};

    if (updateClinicalNoteDto.sessionId !== undefined) {
      data.session = { connect: { id: updateClinicalNoteDto.sessionId } };
    }
    if (updateClinicalNoteDto.therapistId !== undefined) {
      data.therapist = { connect: { id: updateClinicalNoteDto.therapistId } };
    }
    if (updateClinicalNoteDto.patientId !== undefined) {
      data.patient = { connect: { id: updateClinicalNoteDto.patientId } };
    }
    if (updateClinicalNoteDto.content !== undefined) {
      data.content = updateClinicalNoteDto.content;
    }

    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }

    return this.prisma.clinicalNote.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clinicalNote.delete({
      where: { id },
    });
  }
}
