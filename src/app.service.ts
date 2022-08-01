import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment-timezone';

import { LoginDto } from './dto/login.dto';
import { QueueDto } from './dto/queue.dto';
import { RegisterDto } from './dto/register.dto';
import { Queue, QueueDocument } from './schemas/queue.schema';
import { User, UserDocument } from './schemas/user.schema';
import {
  CurrencyRate,
  CurrencyRateDocument,
} from './schemas/currencyrate.schema';
import { GetQueueDto } from './dto/getqueue.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Queue.name) private queueModel: Model<QueueDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CurrencyRate.name) private currencyRateModel: Model<CurrencyRateDocument>,
    private jwtService: JwtService,
  ) {}

  private saltRounds = 10;

  async login(loginDto: LoginDto): Promise<object> {
    try {
      const user = await this.userModel
        .findOne({ username: loginDto.username })
        .lean();
      const match = await bcrypt.compare(loginDto.password, user.password);
      if (match)
        return this.response(
          0,
          this.jwtService.sign({ username: user.username, role: user.role }),
        );
      throw new Error();
    } catch (e) {
      return this.response(800, {});
    }
  }

  async register(registerDto: RegisterDto, role: string): Promise<object> {
    try {
      if (role !== 'SUPERADMIN') return this.response(700, {});
      const hash = bcrypt.hashSync(registerDto.password, this.saltRounds);
      const createdUser = new this.userModel();
      createdUser.username = registerDto.username.toLowerCase();
      createdUser.password = hash;
      await createdUser.save();
      return this.response(0, {});
    } catch (e) {
      if (e.code === 11000) return this.response(801, {});
      return this.response(999, {});
    }
  }

  async saveQueue(queueDto: QueueDto): Promise<object> {
    try {
      if (
        queueDto.fullname &&
        queueDto.telNumber &&
        queueDto.height &&
        queueDto.weight
      ) {
        const createdQueue = new this.queueModel(queueDto);
        createdQueue.timestamp = moment().unix();
        await createdQueue.save();
        return this.response(0, {});
      }
      return this.response(900, {});
    } catch (e) {
      return this.response(999, {});
    }
  }

  async getQueue(getQueueDto: GetQueueDto): Promise<object> {
    try {
      const queueList = await this.queueModel.find({
        timestamp: {
          $gte: moment.tz(getQueueDto.startDate, 'Asia/Bangkok').unix(),
          $lt: moment.tz(getQueueDto.endDate, 'Asia/Bangkok').unix(),
        },
      });
      return this.response(0, { queueList });
    } catch (e) {
      console.log('e =>', e);
      return this.response(999, {});
    }
  }

  async getCurrencyRate(): Promise<object> {
    try {
      const dateId = moment()
        .tz('Asia/Bangkok')
        .subtract('1', 'days')
        .format('YYYY-MM-DD');
      let currencyRate = await this.currencyRateModel
        .findOne({
          dateId,
        })
        .lean();
      if (!currencyRate) {
        const data: any = await axios.get(
          `https://apigw1.bot.or.th/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/`,
          {
            params: {
              start_period: dateId,
              end_period: dateId,
            },
            headers: {
              'X-IBM-Client-Id': process.env.BOT_CLIENT_ID,
            },
          },
        );
        console.log('data.data =>', data.data.result.data.data_detail[0]);
        if (
          data.data.result.data.data_detail &&
          data.data.result.data.data_detail.length > 0 &&
          data.data.result.data.data_detail[0].mid_rate
        ) {
          const currencyRate = data.data.result.data.data_detail;
          const createdCurrencyRate = new this.currencyRateModel();
          createdCurrencyRate.dateId = currencyRate[0].period;
          createdCurrencyRate.timestamp = moment(currencyRate[0].period).unix();
          const rate = {};
          currencyRate.forEach((element: any) => {
            return (rate[element.currency_id] = Number(element.mid_rate));
          });
          createdCurrencyRate.rate = rate;
          await createdCurrencyRate.save();
          return this.response(0, createdCurrencyRate);
        } else {
          currencyRate = await this.currencyRateModel
            .findOne({})
            .sort({ timestamp: -1 })
            .lean();
        }
      }
      return this.response(0, currencyRate);
    } catch (e) {
      const currencyRate = await this.currencyRateModel
        .findOne({})
        .sort({ timestamp: -1 })
        .lean();
      return this.response(0, currencyRate);
    }
  }

  response(code: number, data: any): object {
    return {
      status: ResponseData[code],
      data,
    };
  }
}

const ResponseData = {
  0: {
    code: 0,
    message: 'Success',
  },
  700: {
    code: 700,
    message: 'permission denied',
  },
  800: {
    code: 800,
    message: 'Username or Password not match',
  },
  801: {
    code: 801,
    message: 'Duplicated Username',
  },
  900: {
    code: 900,
    message: 'Invalid Data',
  },
  999: {
    code: 999,
    message: 'Error',
  },
};
