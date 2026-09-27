import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('PORT');
  const appHost = configService.get<string>('HOST');
  await app.listen(appPort, appHost);
}
bootstrap();
