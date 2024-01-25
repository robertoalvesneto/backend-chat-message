// NODE MODULES
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

// Services
import { UserService } from './user.service';

// Entities
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { PublicProp } from 'src/common/decorator/public-rote.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOne(id);
  }

  @PublicProp()
  @Post()
  create(@Body() data: UserDto): Promise<InsertResult> {
    return this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Body() data: UserDto): Promise<UpdateResult> {
    return this.userService.update(data);
  }
}
