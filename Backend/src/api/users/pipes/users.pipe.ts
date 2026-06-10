import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { PrismaService } from '../../../database/prisma.service';
import { Role, User } from '@prisma/client';
@Injectable()
export class UsersPipe implements PipeTransform {
    transform(value: any) {
        if (!this.isUsernameValid(value.username)) {
          throw new BadRequestException('Formato de username inválido');
        }
        
        if (!this.isEmailValid(value.email)) {
          throw new BadRequestException('Formato de email inválido');
        }
  
        if (!this.isPasswordValid(value.password)) {
          throw new BadRequestException('La contraseña debe tener al menos 8 caracteres');
        }

        if (!this.isRoleValid(value.role)) {
          throw new BadRequestException('Rol inválido');
        }
  
        return value;   
    }

    private isUsernameValid (username : string ){
      return username && /^[a-zA-Z0-9]+$/.test(username);
    }

    private isEmailValid (email : string ){
      return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private isPasswordValid (password :  string){
      return password && password.length < 8;
    }
    private isRoleValid (role : Role){
      return role && [Role.COORDINATOR, Role.THERAPIST, Role.PATIENT].includes(role);
    }
}