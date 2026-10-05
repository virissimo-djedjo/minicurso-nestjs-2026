import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { DomainExceptionFilter } from './modules/common/infra/http/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainExceptionFilter());
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
