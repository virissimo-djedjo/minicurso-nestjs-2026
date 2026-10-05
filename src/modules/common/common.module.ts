import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoragePort } from './application/ports/storage.port';
import { LocalStorageAdapter } from './infra/storage/local-storage.adapter';
import { S3StorageAdapter } from './infra/storage/s3-storage.adapter';

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
  ],
  exports: [StoragePort],
})
export class CommonModule {}
