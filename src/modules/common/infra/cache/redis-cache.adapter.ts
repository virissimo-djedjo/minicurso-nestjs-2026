import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { CachePort } from '../../application/ports/cache.port';

export class RedisCacheAdapter
  implements CachePort, OnModuleInit, OnModuleDestroy
{
  private readonly client: ReturnType<typeof createClient>;

  constructor(configService: ConfigService) {
    this.client = createClient({
      url: configService.getOrThrow<string>('cache.redisUrl'),
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  public async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  public async set<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }
}
