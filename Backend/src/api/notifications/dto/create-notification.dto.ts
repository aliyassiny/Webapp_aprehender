import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { NotificationStatus, NotificationType } from "generated/prisma/enums";

export class CreateNotificationDto {

    @IsString()
    @IsNotEmpty()
    userId : string;

    @IsEnum(NotificationType)
    type : NotificationType;

    @IsString()
    message : string;

    @IsEnum(NotificationStatus)
    status : NotificationStatus;
    
}
