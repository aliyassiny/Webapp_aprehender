import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata } from "@nestjs/common";
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PatientsPipe implements PipeTransform<string, Promise<string>> {
    constructor(private readonly prisma: PrismaService) {}

    async transform(value: string, metadata?: ArgumentMetadata): Promise<string> {
        if (!value) {
            throw new BadRequestException('User ID is required');
        }

        // Buscar el profileId del paciente basado en userId
        const patientProfile = await this.prisma.patientProfile.findUnique({
            where: { userId: value },
        });

        if (!patientProfile) {
            throw new BadRequestException('Patient profile not found');
        }

        // Retornamos directamente el profile id del paciente
        return patientProfile.id;
    }
}