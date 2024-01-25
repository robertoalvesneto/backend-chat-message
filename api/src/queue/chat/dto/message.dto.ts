import { Message } from './message.schema';

export class MessageDto {
  sender: string;
  receiver: string;
  date: Date;
  message: string;
  chatName?: string;
  status?: number;

  constructor(msg: Message) {
    this.sender = msg.sender;
    this.receiver = msg.receiver;
    this.date = msg.date;
    this.message = msg.message;
    this.chatName = msg.chatName;
    this.status = msg.status;
  }
}

export class ReceiverMessageDto {
  receiver: string;
}

export class PublicKeyMessageDto {
  sender: string;
  receiver: string;
  publicKey: string;
  hasFriendKey: boolean;
  date: Date;
  status?: number;
}
