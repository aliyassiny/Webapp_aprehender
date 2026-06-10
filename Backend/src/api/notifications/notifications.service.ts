import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private gateway: any = null;

  constructor(private readonly prisma: PrismaService) {}

  // Método para inyectar el gateway después de la inicialización
  setGateway(gateway: any) {
    this.gateway = gateway;
  }

  async create(userId: string, createNotificationDto: CreateNotificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const notification = await this.prisma.notification.create({
      data: {
        userId: userId,
        type: createNotificationDto.type,
        message: createNotificationDto.message,
      },
    });

    // Emitir evento de nueva notificación si el gateway está disponible
    if (this.gateway) {
      this.gateway.sendNotificationToUser(userId, notification);
    }

    return notification;
  }

  async findAll(userId : string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.notification.findMany({
      where: { userId: userId },
    });
  }

  async findOne(id: string, userId : string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async remove(id: string, userId : string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({
      where: { id: id },
      data: {
        status: NotificationStatus.READ,
      },
    });
  }
}
