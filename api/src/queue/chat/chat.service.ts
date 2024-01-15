import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { generateUniqueHash } from 'src/common/function/hash.function';
import { Message } from './dto/message.schema';
import {
  MessageDto,
  PublicKeyMessageDto,
  ReceiverMessageDto,
} from './dto/message.dto';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly mqttService: MqttService,
  ) {}

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'message.send',
    queue: 'message/send',
    queueOptions: { maxLength: 500, durable: true, autoDelete: false },
  })
  async saveMessage(msg: MessageDto): Promise<void | Nack> {
    try {
      console.log(msg);

      // add infos to message
      const chatName = generateUniqueHash(msg.sender, msg.receiver);
      msg.chatName = chatName;
      msg.status = 1;

      // save message into database
      const newMessage = new this.messageModel(msg);
      await newMessage.save();

      // send user status response
      this.mqttService.publish(msg.sender, msg, 2);
    } catch (e) {
      msg.status = -1;
      this.mqttService.publish(msg.sender, msg, 2);

      return new Nack(false);
    }
  }

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'message.receive',
    queue: 'message/receive',
    queueOptions: { maxLength: 500, durable: true, autoDelete: false },
  })
  async getMessage(checkMsg: ReceiverMessageDto): Promise<void | Nack> {
    console.log(checkMsg);

    // find all messages for this user
    const messages = await this.messageModel.find({
      receiver: checkMsg.receiver,
    });

    // delivery one by one
    messages.forEach(async (message) => {
      try {
        // send message to receiver
        this.mqttService.publish(checkMsg.receiver, message, 2);

        // send user status=2 to sender
        message.status = 2;
        this.mqttService.publish(message.sender, message, 2);

        // delete this message from database
        await this.messageModel.findByIdAndDelete(message.id);
      } catch (e) {
        message.status = -1;
        this.mqttService.publish(message.sender, message, 2);

        return new Nack(false);
      }
    });
  }

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'message.publickey',
    queue: 'message/publickey',
    queueOptions: { maxLength: 500, durable: true, autoDelete: false },
  })
  async sendPublicKey(pubkeyMsg: PublicKeyMessageDto): Promise<void | Nack> {
    console.log(pubkeyMsg);

    try {
      // send publickey to receiver
      this.mqttService.publish(pubkeyMsg.receiver, pubkeyMsg, 2);
    } catch (e) {
      return new Nack(false);
    }
  }
}
