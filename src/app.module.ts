import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from './schemas/queue.schema';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dev-doodee:Aa1234@dev-doodee.rnhai.mongodb.net/doodee',
    ),
    MongooseModule.forFeature([
      { name: Queue.name, schema: QueueSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: 'ChamodnoiNarak',
      signOptions: { expiresIn: '24hr' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
