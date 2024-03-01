import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';

interface CacheContent {
    data: AxiosResponse;
    expiry: number;
  }
  
interface ICacheService {
    set(key: string, data: AxiosResponse, duration?: number): void;
    get(key: string): AxiosResponse | null;
}
  
@Injectable()
export class CacheService implements ICacheService {
    private readonly logger = new Logger(CacheService.name);
    private cache = new Map<string, CacheContent>();
    private defaultCacheDuration = 300000;

    set(key: string, data: AxiosResponse, duration: number = this.defaultCacheDuration): void {
        const expiry = Date.now() + duration;
        this.cache.set(key, { data, expiry });
        this.logger.log(`Data cached for key: ${key} with duration: ${duration}ms`);
    }

    get(key: string): AxiosResponse | null {
        const cacheContent = this.cache.get(key);

        if (!cacheContent) {
        return null;
        }

        if (Date.now() > cacheContent.expiry) {
        this.cache.delete(key);
        this.logger.log(`Cache for key: ${key} has expired and been deleted.`);
        return null;
        }

        return cacheContent.data;
    }
}