import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { JwtStrategy } from './jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Queue, QueueSchema } from './schemas/queue.schema';
import { User, UserSchema } from './schemas/user.schema';
import {
  CurrencyRate,
  CurrencyRateSchema,
} from './schemas/currencyrate.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Queue.name, schema: QueueSchema },
      { name: User.name, schema: UserSchema },
      { name: CurrencyRate.name, schema: CurrencyRateSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '24hr' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
