import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CurrencyRateDocument = CurrencyRate & Document;

@Schema()
export class CurrencyRate {
  @Prop({ required: true, unique: true })
  dateId: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  rate: any;

  @Prop({ required: true, index: true })
  timestamp: number;
}

export const CurrencyRateSchema = SchemaFactory.createForClass(CurrencyRate);
