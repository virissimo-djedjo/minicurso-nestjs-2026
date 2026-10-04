import { Module } from '@nestjs/common';
import { UsuariosController } from './infra/http/usuarios.controller';
import SearchUsuarioService from './application/services/search-usuario.service';
import UsuarioRepository from './infra/database/repository/usuario.repository';

const SERVICES = [SearchUsuarioService];

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [UsuarioRepository, ...SERVICES],
  exports: [],
})
export class UsuariosModule {}
