import { Module } from '@nestjs/common';
import { UsuariosController } from './infra/http/usuarios.controller';
import SearchUsuarioService from './application/services/search-usuario.service';
import { UsuarioRepository } from './application/repositories/usuario.repository';
import { PostgresUsuarioRepository } from './infra/database/repository/postgres-usuario.repository';
import { HashPort } from './application/ports/hash.port';
import { ScryptHashAdapter } from './infra/hash/scrypt-hash.adapter';
import { CadastrarUsuarioUsecase } from './application/usecases/cadastrar-usuario.usecase';

const SERVICES = [SearchUsuarioService, CadastrarUsuarioUsecase];

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [
    { provide: UsuarioRepository, useClass: PostgresUsuarioRepository },
    { provide: HashPort, useClass: ScryptHashAdapter },
    ...SERVICES,
  ],
  exports: [],
})
export class UsuariosModule {}
