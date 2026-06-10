import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './api/users/users.module';
import { PatientsModule } from './api/patients/patients.module';
import { TherapistsModule } from './api/therapists/therapists.module';
import { SessionsModule } from './api/sessions/sessions.module';
import { ClinicalNotesModule } from './api/clinical-notes/clinical-notes.module';
import { ReportsModule } from './api/reports/reports.module';
import { NotificationsModule } from './api/notifications/notifications.module';

import { AuthMiddleware } from './auth/middlewares/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './auth/rbac.module';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000,
      limit: 10,
    }]),
    RbacModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    TherapistsModule,
    SessionsModule,
    ClinicalNotesModule,
    ReportsModule,
    NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/auth/login', method: RequestMethod.POST },
        { path: 'api/auth/register', method: RequestMethod.POST },
        { path: 'api/auth/refresh', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('*'); // Aplicar a todas las rutas excepto las excluidas
  }
}
