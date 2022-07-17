import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { QueueDto } from './dto/queue.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiBearerAuth()
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  regsiter(@Body() registerDto: RegisterDto, @Request() req) {
    return this.appService.register(registerDto, req.user.role);
  }

  @Post('saveQueue')
  saveQueue(@Body() queueDto: QueueDto) {
    return this.appService.saveQueue(queueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getQueue')
  getQueue() {
    return this.appService.getQueue();
  }
}
