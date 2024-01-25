// NPM Modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// DTO
import { UserValidated } from '../dto/user.validated.auth.dto';
import { Payload } from '../dto/jwt-token.dto';

// constant
import { jwtConstants } from '../../../common/config/jwt-token-secret-key.config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload): Promise<UserValidated> {
    const { sub, name } = payload;

    return await this.authService
      .userExist(sub)
      .then(() => <UserValidated>{ id: sub, name: name });
  }
}
