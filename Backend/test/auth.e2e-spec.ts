import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicar exactamente la configuración de main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // LOGIN CORRECTO — usa credenciales del .env
  it('POST /auth/login - success', async () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: process.env.EMAIL_ADDRESS,
        password: process.env.PASSWORD,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body).toHaveProperty('data_user');
      });
  });

  // LOGIN FALLIDO — credenciales incorrectas → debe retornar 401
  it('POST /auth/login - wrong credentials', async () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'noexiste@test.com',
        password: 'wrongpassword',
      })
      .expect(401);
  });
});