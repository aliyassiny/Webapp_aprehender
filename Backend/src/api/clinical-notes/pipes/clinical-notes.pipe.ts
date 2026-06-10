import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { PrismaService } from 'src/database/prisma.service';
import { ClinicalNote } from '@prisma/client';
@Injectable()
export class ClinicalNotesPipe implements PipeTransform {
    constructor(private readonly prisma: PrismaService) {}
    async transform(value: ClinicalNote): Promise<ClinicalNote> {
        await this.isPatient(value.id);
        await this.isTherapist(value.id);
        await this.SessionAvailable(value.id)
        await this.ContentValid(value.content)
        return value;
    }
    private async isPatient(id: string) {
        const patient = await this.prisma.patientProfile.findUnique({
            where: { id },
        });
        if (!patient) throw new BadRequestException('Patient not found');
    }

    private async isTherapist(id: string){
        const therapist = await this.prisma.therapistProfile.findUnique({
            where: { id },
        });
        if(!therapist) throw new BadRequestException('Therapist not found')
    }

    private async SessionAvailable(id:string){
        const session = await this.prisma.session.findUnique({
            where : { id },
        });
        if(!session) throw new BadRequestException('session is not fpund')

    }

    private async ContentValid(content:string){
        return content && content.length > 1;
    }

}