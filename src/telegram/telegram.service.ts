import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CacheService } from './telegram-cache.service';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private httpService: HttpService,
    private cacheService: CacheService
  ) {}

  async getCurrencyPrice(apiUrl: string): Promise<any> {
    const cachedResponse = this.cacheService.get(apiUrl);
    if (cachedResponse) {
      this.logger.log(`Returning cached response for ${apiUrl}`);
      return cachedResponse; 
    }

    
    const response = await lastValueFrom(
      this.httpService.get(apiUrl).pipe(
        map(response => response.data) 
      )
    );

    this.cacheService.set(apiUrl, response, 300000); 
    return response;
  }
}