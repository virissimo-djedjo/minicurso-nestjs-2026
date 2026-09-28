import { Module } from '@nestjs/common';
import { UsuariosController } from './infra/presentation/http/usuarios.controller';

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [],
  exports: [],
})
export class UsuariosModule {}
