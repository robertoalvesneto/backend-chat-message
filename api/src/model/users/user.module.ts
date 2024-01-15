import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { MqttModule } from 'src/queue/mqtt/mqtt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MqttModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
