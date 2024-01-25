// NPM Modules
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// My Modules
import { UserModule } from '../users/user.module';

// auth
import { LocalStrategy } from './local-auth/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// jwt
import { jwtConstants } from '../../common/config/jwt-token-secret-key.config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtMqttStrategy } from './jwt/jwt-mqtt-strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtMqttStrategy],
  exports: [AuthService],
})
export class AuthModule {}
