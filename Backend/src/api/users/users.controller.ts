import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@UseGuards(RolesGuard, ThrottlerGuard)
@Roles(Role.COORDINATOR)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Throttle( { default: {ttl: 60000, limit: 5}})
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Throttle( { default: {ttl: 60000, limit: 5}})
  @Roles(Role.COORDINATOR, Role.THERAPIST)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Throttle( { default: {ttl: 60000, limit: 5}})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Throttle( { default: {ttl: 60000, limit: 5}})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Throttle( { default: {ttl: 60000, limit: 5}})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
