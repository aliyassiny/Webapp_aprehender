import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sessions (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicar la configuración de main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();

    // LOGIN para obtener token
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: process.env.EMAIL_ADDRESS_1,
        password: process.env.PASSWORD_1,
      });

    token = res.body.accessToken;
  });

  // CREAR SESIÓN
  // VALIDAR SOLAPAMIENTO
  it('POST /sessions - overlapping', async () => {
    const payload = {
      therapistId: '13e6deac-4ea2-4ea8-a823-19e44196e805',
      patientId: 'b0d1f0d0-34e4-43e7-ac1f-32cbdf07ffaa',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      isVirtual: true,
      meetingLink: 'https://meet.google.com/abc-defg-hoj',
      status: 'SCHEDULED',
    };

    // crear primera sesión
    await request(app.getHttpServer())
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    // intentar crear otra igual
    return request(app.getHttpServer())
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});