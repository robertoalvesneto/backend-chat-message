// NPM Modules
import { Request, Post, UseGuards, Body, Controller } from '@nestjs/common';

// MyModules
import { PublicProp } from '../../common/decorator/public-rote.decorator';
import { LocalAuthGuard } from './local-auth/local-auth.guard';

// service
import { AuthService } from './auth.service';

// Entity
import { User } from '../users/entity/user.entity';

// DTO
import { LoginValidateDto } from './dto/login.validate.dto';
import { JwtAccessToken } from './dto/jwt-token.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicProp()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<JwtAccessToken> {
    const reqValidateObj = (await req) as { user: User };
    const user = reqValidateObj.user;

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-login')
  async validateLogin(@Body() data: LoginValidateDto): Promise<boolean> {
    return await this.authService.validateLogin(data);
  }
}
