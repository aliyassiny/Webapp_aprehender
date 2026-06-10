import { Injectable, PipeTransform, BadRequestException, ArgumentMetadata } from "@nestjs/common";
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TherapistIdPipe implements PipeTransform<string, Promise<string>> {
    constructor(private readonly prisma: PrismaService) {}

    async transform(value: string, metadata?: ArgumentMetadata): Promise<string> {
        if (!value) {
            throw new BadRequestException('User ID is required');
        }

        // Buscar el profileId del terapeuta basado en userId
        const therapistProfile = await this.prisma.therapistProfile.findUnique({
            where: { userId: value },
        });

        if (!therapistProfile) {
            throw new BadRequestException('Therapist profile not found');
        }

        // Retornamos directamente el profile id del terapeuta
        return therapistProfile.id;
    }
}
