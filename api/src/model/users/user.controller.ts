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
import { UpdateResult } from 'typeorm';

// Services
import { UserService } from './user.service';

// Entities
import { UserDto } from './dto/user.dto';
import { PublicProp } from 'src/common/decorator/public-rote.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  async getOne(@Param('name') name: string): Promise<{ name: string }> {
    const user = await this.userService.getOne(name);
    return { name: user.name + '#' + user.id.split('-')[1] };
  }

  @PublicProp()
  @Post()
  create(@Body() data: UserDto): Promise<{ name: string }> {
    return this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Body() data: UserDto): Promise<UpdateResult> {
    return this.userService.update(data);
  }
}
