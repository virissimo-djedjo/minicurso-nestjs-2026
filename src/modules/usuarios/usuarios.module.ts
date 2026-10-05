import { Module } from '@nestjs/common';
import { UsuariosController } from './infra/http/usuarios.controller';
import SearchUsuarioService from './application/services/search-usuario.service';
import { UsuarioRepository } from './application/repositories/usuario.repository';
import { PostgresUsuarioRepository } from './infra/database/repository/postgres-usuario.repository';

const SERVICES = [SearchUsuarioService];

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [
    { provide: UsuarioRepository, useClass: PostgresUsuarioRepository },
    ...SERVICES,
  ],
  exports: [],
})
export class UsuariosModule {}
