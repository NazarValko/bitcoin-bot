import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './telegram.update';
import { APP_FILTER } from '@nestjs/core';
import { CacheService } from './telegram-cache.service';
import { TelegrafExceptionFilter } from 'src/common/telegraf-exception.filter';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    HttpModule
  ],
  providers: [
    TelegramService,
    TelegramUpdate,
    CacheService,
    {
      provide: APP_FILTER,
      useClass: TelegrafExceptionFilter,
    },
  ],
})
export class TelegramModule {}
