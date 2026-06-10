import { Module } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { TherapistsController } from './therapists.controller';
import { PrismaService } from '../../database/prisma.service';
@Module({
  controllers: [TherapistsController],
  providers: [TherapistsService, PrismaService],
})
export class TherapistsModule {}
