export class MessageDto {
  sender: string;
  receiver: string;
  date: Date;
  message: string;
  chatName?: string;
  status?: number;
}

export class ReceiverMessageDto {
  receiver: string;
}

export class PublicKeyMessageDto {
  sender: string;
  receiver: string;
  publickey: string;
}

export class MessageStatusDto {
  status: number;
}
