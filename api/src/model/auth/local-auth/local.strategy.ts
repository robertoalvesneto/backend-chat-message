import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Strategy } from 'passport-local';

import { UserValidated } from '../dto/user.validated.auth.dto';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
  }

  async validate(name: string, password: string): Promise<UserValidated> {
    const userValidated = await this.authService.validateUser(name, password);

    if (!userValidated) throw new UnauthorizedException();

    return userValidated;
  }
}
