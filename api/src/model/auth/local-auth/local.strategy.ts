import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Strategy } from 'passport-local';

import { UserValidated } from '../dto/user.validated.auth.dto';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'id',
      passwordField: 'password',
    });
  }

  async validate(uuid: string, password: string): Promise<UserValidated> {
    const userValidated = await this.authService.validateUser(uuid, password);

    console.log(uuid, password);
    if (!userValidated)
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    return userValidated;
  }
}
