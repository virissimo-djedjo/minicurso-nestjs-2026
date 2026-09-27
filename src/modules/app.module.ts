import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    CommonModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
