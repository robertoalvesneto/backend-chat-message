// NPM Modules
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Aux
import { hashCompare } from 'src/common/function/hash.function';

// Service
import { UserService } from '../users/user.service';

// Entity
import { User } from '../users/entity/user.entity';

// DTO
import { UserValidated } from './dto/user.validated.auth.dto';
import { JwtAccessToken, Payload } from './dto/jwt-token.dto';
import { LoginValidateDto } from './dto/login.validate.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Create access token;
   * @param Payload data used in jwt token;
   * @return jwt access token;
   */
  createAccessToken(payload: Payload): JwtAccessToken {
    const _tmpToken = this.jwtService.sign(payload, {
      expiresIn: '12h',
      jwtid: 'access',
    });

    const _tmpPayload: JwtPayload = jwtDecode(_tmpToken);

    const expires_in = _tmpPayload.exp
      ? new Date(_tmpPayload.exp * 1000).toString()
      : new Date().toString();

    return {
      access_token: {
        token: _tmpToken,
        expires_in,
      },
    } as unknown as JwtAccessToken;
  }

  /**
   * Get user and create object, if find user;
   * @param name (string);
   * @param password (string);
   * @return UserValidated if login work, else null;
   * @throws [
   *    404 NOT FOUND           -       cant get user by name;
   *    ]
   */
  async validateUser(
    name: string,
    pass: string,
  ): Promise<UserValidated | null> {
    try {
      const user: User = await this.userService.getOne(name);
      if (user && hashCompare(pass, user.password)) {
        const response = <UserValidated>{
          id: user.id,
          name: user.name,
        };

        return response;
      }

      return null;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Check if user pass in token exist in database
   * @param name (string);
   * @return true;
   * @throws [
   *    404 NOT FOUND           -       cant get user by name;
   *    401 UNAUTHORIZED        -       user unauthorized;
   *    ]
   */
  async userExist(sub: string, name: string): Promise<boolean> {
    try {
      const username = name + '#' + sub.split('-')[1];
      const user: User = await this.userService.getOne(username);

      if (user) return true;

      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Auth user and return access token;
   * @param UserValidated user data;
   * @return jwt access token;
   */
  login(user: UserValidated): JwtAccessToken {
    const payload = { sub: user.id, name: user.name };

    const response = this.createAccessToken(payload);
    response.user = user;

    return response;
  }

  /**
   * Check if user password is valid, useful for the double check
   * credentials in a critical operations;
   * @param LoginValidateDto: user id and password;
   * @return is a valid password?;
   * @throws [
   *    404 NOT FOUND           -       cant get user by id;
   *    ]
   */
  async validateLogin(data: LoginValidateDto): Promise<boolean> {
    const user: User = await this.userService.getOne(data.id);

    return user && hashCompare(data.password, user.password);
  }
}
