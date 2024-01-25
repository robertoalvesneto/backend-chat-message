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
      console.log('\n\x1b[94m > MENSAGEM RECEBIDA: \x1b[0m');
      console.log(`\x1b[94m > ${msg.sender}: \x1b[0m` + JSON.stringify(msg));

      // add infos to message
      const chatName = generateUniqueHash(msg.sender, msg.receiver);
      msg.chatName = chatName;
      msg.status = 1;

      // save message into database
      const newMessage = new this.messageModel(msg);
      await newMessage.save();

      this.sSaveStatus(msg);

      console.log('\x1b[94m > MENSAGEM SALVA: \x1b[0m\n\n');
    } catch (e) {
      console.log(e);
      this.eResponseStatus(msg);
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
    // find all messages for this user
    const msgs = await this.messageModel.find({ receiver: checkMsg.receiver });

    if (msgs.length > 0) {
      console.log('\n\x1b[92m > ENVIANDO MENSAGEM: \x1b[0m');
    }
    // delivery one by one
    msgs.forEach(async (msg) => {
      try {
        const msgDto = new MessageDto(msg);
        console.log(
          `\x1b[92m > ${checkMsg.receiver}: \x1b[0m` + JSON.stringify(msgDto),
        );

        // send message to receiver
        this.mqttService.publish(checkMsg.receiver, msgDto, 2);

        this.sDeliveryStatus(msgDto);

        // delete this message from database
        await this.messageModel.findByIdAndDelete(msg.id);

        console.log('\n\n');
      } catch (e) {
        this.eResponseStatus(msg);
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
    try {
      console.log(
        `\x1b[90m > PUBLICKEY: \x1b[0m ${pubkeyMsg.sender} \x1b[90m TO \x1b[0m ${pubkeyMsg.receiver}`,
      );
      console.log(
        `\x1b[90m | \x1b[0m ${JSON.stringify(pubkeyMsg.publicKey)} \n`,
      );

      // send publickey to receiver
      this.mqttService.publish(pubkeyMsg.receiver, pubkeyMsg, 2);

      this.sDeliveryStatus(pubkeyMsg);
    } catch (e) {
      console.log(e);
      this.eResponseStatus(pubkeyMsg);
      return new Nack(false);
    }
  }

  /**
   * Send the status of the successfully saved message to the Sender
   * @param msg message to send save status
   */
  async sSaveStatus(msg) {
    msg.status = 1;
    this.mqttService.publish(msg.sender, msg, 2);
  }

  /**
   * Send the status of the successfully delivered message to the Sender
   * @param msg message to send delivery status
   */
  async sDeliveryStatus(msg) {
    msg.status = 2;
    this.mqttService.publish(msg.sender, msg, 2);
  }

  /**
   * Send the status of the error message to the Sender
   * @param msg message to send error status
   */
  async eResponseStatus(msg) {
    msg.status = -1;
    this.mqttService.publish(msg.sender, msg, 2);
  }
}
