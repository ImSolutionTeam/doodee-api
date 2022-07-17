import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QueueDocument = Queue & Document;

@Schema()
export class Queue {
  @Prop({ required: true, index: true })
  fullname: string;

  @Prop({ required: true, index: true })
  telNumber: string;

  @Prop({ default: '' })
  lindId: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  province: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true, index: true })
  timestamp: number;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
