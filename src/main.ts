import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { DomainExceptionFilter } from './modules/common/infra/http/domain-exception.filter';
import fastifyMultipart from '@fastify/multipart';
import { MAX_IMAGEM_SIZE } from './modules/common/infra/http/multipart.util';
import { UPLOADS_ROOT } from './modules/common/infra/storage/local-storage.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainExceptionFilter());
  app.useStaticAssets({ root: join(process.cwd(), 'client', 'dist') });
  app.useStaticAssets({
    root: UPLOADS_ROOT,
    prefix: '/uploads/',
    decorateReply: false,
  });
  await app.register(fastifyMultipart, {
    limits: { fileSize: MAX_IMAGEM_SIZE },
  });
  const configService = app.get(ConfigService);
  const appPort = configService.getOrThrow<number>('app.port', {
    infer: true,
  })!;
  const appHost = configService.getOrThrow<string>('app.host', {
    infer: true,
  })!;
  await app.listen(appPort, appHost);
}
bootstrap();
