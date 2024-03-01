import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './telegram.update';
import { APP_FILTER } from '@nestjs/core';

import { CacheService } from './telegram-cache.service';


@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
  ],
  providers: [
    TelegramService,
    TelegramUpdate,
    CacheService,
    
  ],
})
export class TelegramModule {}
