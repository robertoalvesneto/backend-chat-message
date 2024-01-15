// NODE MODULES
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

// Services
import { UserService } from './user.service';

// Entities
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOne(id);
  }

  @Post()
  create(@Body() data: UserDto): Promise<InsertResult> {
    return this.userService.create(data);
  }

  @Patch(':id')
  update(@Body() data: UserDto): Promise<UpdateResult> {
    return this.userService.update(data);
  }
}
