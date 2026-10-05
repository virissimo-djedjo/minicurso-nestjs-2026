import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoragePort } from './application/ports/storage.port';
import { LocalStorageAdapter } from './infra/storage/local-storage.adapter';
import { S3StorageAdapter } from './infra/storage/s3-storage.adapter';
import { CachePort } from './application/ports/cache.port';
import { MapCacheAdapter } from './infra/cache/map-cache.adapter';
import { RedisCacheAdapter } from './infra/cache/redis-cache.adapter';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: StoragePort,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('storage.provider') === 's3'
          ? new S3StorageAdapter(configService)
          : new LocalStorageAdapter(),
    },
    {
      provide: CachePort,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('cache.provider') === 'redis'
          ? new RedisCacheAdapter(configService)
          : new MapCacheAdapter(),
    },
  ],
  exports: [StoragePort, CachePort],
})
export class CommonModule {}
