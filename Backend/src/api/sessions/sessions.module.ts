import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { PrismaService } from 'src/database/prisma.service';
import { SessionsCreatePipe, SessionsUpdatePipe } from './pipes/sessions.pipe';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    PrismaService,
    SessionsCreatePipe,
    SessionsUpdatePipe,
  ],
})
export class SessionsModule {}
