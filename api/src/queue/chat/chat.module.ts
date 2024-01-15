import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { AMQPModulesOptions } from 'src/common/config/amqp.config';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './dto/message.schema';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    RabbitMQModule.forRoot(RabbitMQModule, AMQPModulesOptions),
    MqttModule,
  ],
  providers: [ChatService],
})
export class ChatModule {}
