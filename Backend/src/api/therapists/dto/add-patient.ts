import { IsDate, IsNotEmpty, IsString } from "class-validator";



export class AddPatientDto {
    @IsNotEmpty()
    @IsString()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    therapistId: string;

}