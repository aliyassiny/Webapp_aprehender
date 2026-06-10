import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  getPatient(id: string) {
    return this.prisma.patientProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, email: true, role: true },
        },
      },
    });
  }

  updatePatient(id: string, dto: UpdatePatientDto) {
    return this.prisma.patientProfile.update({
      where: { id },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        phone: dto.phone,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true, role: true },
        },
      },
    });
  }

  getClinicalNotes(id: string) {
    return this.prisma.clinicalNote.findMany({
      where: { patientId: id },
    });
  }

  getSessions(id: string) {
    return this.prisma.session.findMany({
      where: { patientId: id },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
        patient: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  getTherapists(id: string) {
    return this.prisma.patientTherapist.findMany({
      where: { patientId: id },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
    
}
