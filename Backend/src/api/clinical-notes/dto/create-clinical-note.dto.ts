import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateClinicalNoteDto {

    @IsOptional()
    @IsString()
    sessionId?: string

    @IsNotEmpty()
    @IsString()
    patientId: string

    @IsNotEmpty()
    @IsString()
    therapistId : string

    @IsNotEmpty()
    @IsString()
    content : string
}
