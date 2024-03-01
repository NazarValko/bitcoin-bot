import { Hears, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { TelegramService } from './telegram.service';
import { Injectable, Logger } from '@nestjs/common';

@Update()
@Injectable()
export class TelegramUpdate {
    private readonly logger = new Logger(TelegramUpdate.name);
    constructor(private readonly telegramService: TelegramService) {}

    @Start()
    async start(ctx: Context) {
      this.logger.log('Starting the bot, sending welcome message...');
      await ctx.reply('Welcome to the Bitcoin Price Bot!', Markup.keyboard([
        Markup.button.text('Get Bitcoin Price')
      ]).resize());
      this.logger.log('Welcome message sent.');
    }

    @Hears('Get Bitcoin Price')
    async onGetBitcoinPrice(ctx: Context) {  
      this.logger.log('Fetching Bitcoin price...');
      try {
        const response = await this.telegramService.getCurrencyPrice('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const rate = response.data.bpi.USD.rate; 
        this.logger.log(`Bitcoin price fetched: ${rate} USD`);
        await ctx.reply(`Current Bitcoin : ${rate} USD`);
      } catch (error) {
        this.logger.error('Error fetching the Bitcoin price.', error.stack);
        await ctx.reply('Sorry, there was an error fetching the Bitcoin price.');
      }
    }
    
}
