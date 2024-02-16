import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  chatName: string;

  @Prop({ required: false })
  status: number;

  @Prop({ default: Date.now })
  date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ sender: 1, receiver: 1, chatName: 1 });
