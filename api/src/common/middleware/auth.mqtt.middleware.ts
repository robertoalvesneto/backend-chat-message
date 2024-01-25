// Middleware ou Interceptor para autenticação MQTT
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MqttAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extrai o token JWT dos cabeçalhos MQTT
    const token = req.headers['authorization'] as string;

    if (!token) {
      throw new UnauthorizedException('Token JWT não fornecido');
    }

    try {
      // Verifica e decodifica o token JWT
      const decoded = jwt.verify(token, 'seuSegredo'); // substitua pelo seu segredo real
      req['user'] = decoded; // adiciona o usuário decodificado ao objeto de solicitação

      // Aqui você pode fazer mais verificações ou processamento, se necessário

      // Continue com o middleware
      next();
    } catch (error) {
      throw new UnauthorizedException('Token JWT inválido');
    }
  }
}
