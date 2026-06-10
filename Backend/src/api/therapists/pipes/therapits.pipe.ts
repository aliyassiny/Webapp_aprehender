import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { PrismaService } from '../../../database/prisma.service';
import { AddPatientDto } from "../dto/add-patient";

@Injectable()
export class TherapistsPipe implements PipeTransform {
    constructor(private readonly prisma: PrismaService) {}
    
    async transform(value: AddPatientDto): Promise<AddPatientDto> {
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

        return value;
    }
}