import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createSession(createSessionDto: CreateSessionDto) {
    const session = await this.prisma.session.create({
      data: {
        therapistId: createSessionDto.therapistId,
        patientId: createSessionDto.patientId,
        startTime: createSessionDto.startTime,
        endTime: createSessionDto.endTime,
        meetingLink: createSessionDto.meetingLink,
        status: createSessionDto.status,
        isVirtual: createSessionDto.isVirtual,
        notes: createSessionDto.notes
          ? {
              create: createSessionDto.notes.map((note) => ({
                content: note.content,
                therapistId: createSessionDto.therapistId,
                patientId: createSessionDto.patientId,
              })),
            }
          : undefined,
      },
      include: {
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

    // Crear notificaciones para paciente y terapeuta
    const formattedDate = format(new Date(session.startTime), "d 'de' MMMM 'a las' HH:mm", { locale: es });

    // Notificación al paciente
    await this.notificationsService.create(session.patient.userId, {
      userId: session.patient.userId,
      type: 'CONFIRMATION',
      message: `Nueva sesión programada con ${session.therapist.user.username} para el ${formattedDate}`,
      status: 'SENT',
    });

    // Notificación al terapeuta
    await this.notificationsService.create(session.therapist.userId, {
      userId: session.therapist.userId,
      type: 'CONFIRMATION',
      message: `Nueva sesión programada con ${session.patient.user.username} para el ${formattedDate}`,
      status: 'SENT',
    });

    return session;
  }

  getSessions() {
    return this.prisma.session.findMany({
      include: {
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
      orderBy: { createdAt: 'desc' },
    });
  }

  getSession(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: {
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
        notes: true,
      },
    });
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const existing = await this.getSession(id);
    if (!existing) throw new NotFoundException(`Session ${id} no encontrada`);

    const data: Prisma.SessionUpdateInput = {};
    let statusChanged = false;
    let timeChanged = false;

    if (updateSessionDto.therapistId !== undefined) {
      data.therapist = { connect: { id: updateSessionDto.therapistId } };
    }
    if (updateSessionDto.patientId !== undefined) {
      data.patient = { connect: { id: updateSessionDto.patientId } };
    }
    if (updateSessionDto.startTime !== undefined) {
      data.startTime = updateSessionDto.startTime;
      timeChanged = true;
    }
    if (updateSessionDto.endTime !== undefined) {
      data.endTime = updateSessionDto.endTime;
    }
    if (updateSessionDto.meetingLink !== undefined) {
      data.meetingLink = updateSessionDto.meetingLink;
    }
    if (updateSessionDto.status !== undefined) {
      data.status = updateSessionDto.status;
      statusChanged = existing.status !== updateSessionDto.status;
    }

    if (updateSessionDto.notes !== undefined) {
      const therapistId = updateSessionDto.therapistId ?? existing.therapistId;
      const patientId = updateSessionDto.patientId ?? existing.patientId;

      data.notes = {
        deleteMany: {},
        create: updateSessionDto.notes.map((note) => ({
          content: note.content,
          therapistId,
          patientId,
        })),
      };
    }

    const updatedSession = await this.prisma.session.update({
      where: { id },
      data,
      include: {
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
        notes: true,
      },
    });

    // Crear notificaciones según el cambio
    const formattedDate = format(new Date(updatedSession.startTime), "d 'de' MMMM 'a las' HH:mm", { locale: es });

    if (statusChanged && updateSessionDto.status === 'CANCELED') {
      // Notificación de cancelación
      await this.notificationsService.create(updatedSession.patient.userId, {
        userId: updatedSession.patient.userId,
        type: 'CANCELLATION',
        message: `La sesión del ${formattedDate} con ${updatedSession.therapist.user.username} ha sido cancelada`,
        status: 'SENT',
      });

      await this.notificationsService.create(updatedSession.therapist.userId, {
        userId: updatedSession.therapist.userId,
        type: 'CANCELLATION',
        message: `La sesión del ${formattedDate} con ${updatedSession.patient.user.username} ha sido cancelada`,
        status: 'SENT',
      });
    } else if (timeChanged) {
      // Notificación de cambio de horario
      await this.notificationsService.create(updatedSession.patient.userId, {
        userId: updatedSession.patient.userId,
        type: 'REMINDER',
        message: `La sesión con ${updatedSession.therapist.user.username} ha sido reprogramada para el ${formattedDate}`,
        status: 'SENT',
      });

      await this.notificationsService.create(updatedSession.therapist.userId, {
        userId: updatedSession.therapist.userId,
        type: 'REMINDER',
        message: `La sesión con ${updatedSession.patient.user.username} ha sido reprogramada para el ${formattedDate}`,
        status: 'SENT',
      });
    }

    return updatedSession;
  }

  remove(id: string) {
    this.getSession(id)
    return this.prisma.session.delete({
      where: { id }
    });
  }
}
