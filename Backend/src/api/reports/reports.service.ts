import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { SessionStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReport(dto: GenerateReportDto) {
    const { startDate, endDate, therapistId, patientId } = dto;

    // Construir filtros dinámicos
    const where: any = {
      startTime: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    // Si se proporciona therapistId (userId), buscar el profileId
    if (therapistId) {
      const therapistProfile = await this.prisma.therapistProfile.findUnique({
        where: { userId: therapistId },
      });
      if (therapistProfile) {
        where.therapistId = therapistProfile.id;
      }
    }

    // Si se proporciona patientId (userId), buscar el profileId
    if (patientId) {
      const patientProfile = await this.prisma.patientProfile.findUnique({
        where: { userId: patientId },
      });
      if (patientProfile) {
        where.patientId = patientProfile.id;
      }
    }

    // Obtener sesiones en el rango
    const sessions = await this.prisma.session.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
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
              },
            },
          },
        },
        notes: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Calcular estadísticas
    const totalSessions = sessions.length;
    const scheduledSessions = sessions.filter(s => s.status === SessionStatus.SCHEDULED).length;
    const completedSessions = sessions.filter(s => s.status === SessionStatus.COMPLETED).length;
    const canceledSessions = sessions.filter(s => s.status === SessionStatus.CANCELED).length;
    const absentSessions = sessions.filter(s => s.status === SessionStatus.ABSENT).length;

    // Estadísticas de notas clínicas
    const totalNotes = sessions.reduce((acc, session) => acc + session.notes.length, 0);
    const sessionsWithNotes = sessions.filter(s => s.notes.length > 0).length;
    const averageNotesPerSession = totalSessions > 0 ? (totalNotes / totalSessions).toFixed(2) : '0';

    // Agrupar por terapeuta
    const therapistStats = sessions.reduce((acc, session) => {
      const therapistId = session.therapist.id;
      const therapistName = session.therapist.user.username;

      if (!acc[therapistId]) {
        acc[therapistId] = {
          id: therapistId,
          name: therapistName,
          email: session.therapist.user.email,
          totalSessions: 0,
          completedSessions: 0,
          canceledSessions: 0,
          scheduledSessions: 0,
          absentSessions: 0,
          totalNotes: 0,
        };
      }

      acc[therapistId].totalSessions++;
      acc[therapistId].totalNotes += session.notes.length;

      if (session.status === SessionStatus.COMPLETED) acc[therapistId].completedSessions++;
      if (session.status === SessionStatus.CANCELED) acc[therapistId].canceledSessions++;
      if (session.status === SessionStatus.SCHEDULED) acc[therapistId].scheduledSessions++;
      if (session.status === SessionStatus.ABSENT) acc[therapistId].absentSessions++;

      return acc;
    }, {} as Record<string, any>);

    // Agrupar por paciente
    const patientStats = sessions.reduce((acc, session) => {
      const patientId = session.patient.id;
      const patientName = session.patient.user.username;

      if (!acc[patientId]) {
        acc[patientId] = {
          id: patientId,
          name: patientName,
          email: session.patient.user.email,
          totalSessions: 0,
          completedSessions: 0,
          canceledSessions: 0,
          scheduledSessions: 0,
          absentSessions: 0,
          totalNotes: 0,
        };
      }

      acc[patientId].totalSessions++;
      acc[patientId].totalNotes += session.notes.length;

      if (session.status === SessionStatus.COMPLETED) acc[patientId].completedSessions++;
      if (session.status === SessionStatus.CANCELED) acc[patientId].canceledSessions++;
      if (session.status === SessionStatus.SCHEDULED) acc[patientId].scheduledSessions++;
      if (session.status === SessionStatus.ABSENT) acc[patientId].absentSessions++;

      return acc;
    }, {} as Record<string, any>);

    return {
      period: {
        startDate,
        endDate,
      },
      filters: {
        therapistId: therapistId || null,
        patientId: patientId || null,
      },
      summary: {
        totalSessions,
        scheduledSessions,
        completedSessions,
        canceledSessions,
        absentSessions,
        totalNotes,
        sessionsWithNotes,
        averageNotesPerSession,
      },
      therapistStats: Object.values(therapistStats),
      patientStats: Object.values(patientStats),
      sessions: sessions.map(session => ({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        meetingLink: session.meetingLink,
        therapist: {
          id: session.therapist.id,
          name: session.therapist.user.username,
          email: session.therapist.user.email,
        },
        patient: {
          id: session.patient.id,
          name: session.patient.user.username,
          email: session.patient.user.email,
        },
        notesCount: session.notes.length,
        notes: session.notes.map(note => ({
          id: note.id,
          content: note.content,
          createdAt: note.createdAt,
        })),
      })),
    };
  }
}
