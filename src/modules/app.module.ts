import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    CommonModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
