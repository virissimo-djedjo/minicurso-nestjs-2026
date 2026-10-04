import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
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
