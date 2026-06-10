import { Module } from '@nestjs/common';
import { ClinicalNotesService } from './clinical-notes.service';
import { ClinicalNotesController } from './clinical-notes.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ClinicalNotesController],
  providers: [ClinicalNotesService, PrismaService],
})
export class ClinicalNotesModule {}
