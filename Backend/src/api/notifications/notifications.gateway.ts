import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  afterInit() {
    this.notificationsService.setGateway(this);
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('findAllNotifications')
  async findAll(@MessageBody() userId: string) {
    return this.notificationsService.findAll(userId);
  }

  @SubscribeMessage('removeNotification')
  async remove(@MessageBody() data: { id: string; userId: string }) {
    return this.notificationsService.remove(data.id, data.userId);
  }

  // Método para enviar notificaciones a un usuario específico
  sendNotificationToUser(userId: string, notification: any) {
    this.server.emit(`notification:${userId}`, notification);
  }
}
