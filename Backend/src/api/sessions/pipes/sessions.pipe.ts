import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { SessionStatus } from '@prisma/client';

function assertStartTimeNotPastDay(startTime: Date) {
  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) {
    throw new BadRequestException('startTime inválido');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  if (startDay < today) {
    throw new BadRequestException(
      'La fecha de inicio no puede ser de un día que ya pasó',
    );
  }
}

function assertEndTimeAfterStartTime(startTime: Date, endTime: Date) {
  if (endTime <= startTime) {
    throw new BadRequestException(
      'La fecha de fin no puede ser anterior a la fecha de inicio',
    );
  }
}

@Injectable()
export class SessionsCreatePipe implements PipeTransform<CreateSessionDto, Promise<CreateSessionDto>> {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: CreateSessionDto): Promise<CreateSessionDto> {
    assertStartTimeNotPastDay(value.startTime);
    assertEndTimeAfterStartTime(value.startTime, value.endTime);
    
    // Buscar el profileId del terapeuta basado en userId
    const therapistProfile = await this.prisma.therapistProfile.findUnique({
      where: { userId: value.therapistId },
    });
    if (!therapistProfile) {
      throw new BadRequestException('Therapist profile not found');
    }
    
    // Buscar el profileId del paciente basado en userId
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId: value.patientId },
    });
    if (!patientProfile) {
      throw new BadRequestException('Patient profile not found');
    }
    
    // Reemplazar los userId con los profileId
    value.therapistId = therapistProfile.id;
    value.patientId = patientProfile.id;
    
    await this.sessionAvailability(value.startTime, value.endTime, value.status, value.patientId, value.therapistId);
    return value;
  }

  // Validamos las sessiones para evitar cruzarlas 
  private async sessionAvailability(startTime: Date, endTime: Date, status : SessionStatus ,patientId:string,therapistId:string) {
    const sessions = await this.prisma.session.findMany({
      where: {
        startTime: { lt: endTime },
        endTime: { gt: startTime },
        status : SessionStatus.SCHEDULED,
        patientId : patientId,
        therapistId: therapistId
      },
    });
    if (sessions.length > 0) {
      throw new BadRequestException('Session not available');
    }
  }
}

@Injectable()
export class SessionsUpdatePipe
  implements PipeTransform<UpdateSessionDto, Promise<UpdateSessionDto>>
{
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: UpdateSessionDto): Promise<UpdateSessionDto> {
    // Solo validar fechas pasadas si se están reprogramando ambas fechas
    // Esto permite actualizar el estado de sesiones pasadas sin problemas
    if (value.startTime !== undefined && value.endTime !== undefined) {
      assertEndTimeAfterStartTime(value.startTime, value.endTime);
    }

    if (value.therapistId !== undefined) {
      await this.assertTherapist(value.therapistId);
    }
    if (value.patientId !== undefined) {
      await this.assertPatient(value.patientId);
    }
    return value;
  }

  private async assertTherapist(id: string) {
    const therapist = await this.prisma.therapistProfile.findUnique({
      where: { id },
    });
    if (!therapist) {
      throw new BadRequestException('Therapist not found');
    }
  }

  private async assertPatient(id: string) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id },
    });
    if (!patient) {
      throw new BadRequestException('Patient not found');
    }
  }
}
