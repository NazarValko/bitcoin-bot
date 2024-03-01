import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { CacheService } from './telegram-cache.service';

export interface ITelegramService {
  getCurrencyPrice(apiUrl: string): Promise<AxiosResponse>;
}

@Injectable()
export class TelegramService implements ITelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private cacheService: CacheService) {}

  async getCurrencyPrice(apiUrl: string): Promise<AxiosResponse> {
    const cachedResponse = this.cacheService.get(apiUrl);
    if (cachedResponse) {
      this.logger.log(`Returning cached response for ${apiUrl}`);
      return cachedResponse;
    }

    try {
      const response = await axios.get(apiUrl);
      this.cacheService.set(apiUrl, response, 300000);
      return response;
    } catch (error) {
      this.logger.error(`Error fetching currency price: ${error.message}`, error.stack);
      if (error instanceof AxiosError && error.response) {
        throw new Error(`API Error: ${error.response.statusText}`);
      } else {
        throw new Error('Unknown error occurred while fetching currency price.');
      }
    }
  }
}
