import { Module } from '@nestjs/common';
import { UsuariosController } from './infra/http/usuarios.controller';
import SearchUsuarioService from './application/services/search-usuario.service';
import { UsuarioRepository } from './application/repositories/usuario.repository';
import { PostgresUsuarioRepository } from './infra/database/repository/postgres-usuario.repository';
import { HashPort } from './application/ports/hash.port';
import { ScryptHashAdapter } from './infra/hash/scrypt-hash.adapter';
import { CadastrarUsuarioUsecase } from './application/usecases/cadastrar-usuario.usecase';
import { AutenticarUsuarioUsecase } from './application/usecases/autenticar-usuario.usecase';
import { GetPerfilUsecase } from './application/usecases/get-perfil.usecase';
import { AuthController } from './infra/http/auth.controller';
import { AtualizarImagemPerfilUsecase } from './application/usecases/atualizar-imagem-perfil.usecase';
import { CommonModule } from '../common/common.module';
import { EnderecosModule } from '../enderecos/enderecos.module';

const SERVICES = [
  SearchUsuarioService,
  CadastrarUsuarioUsecase,
  AutenticarUsuarioUsecase,
  GetPerfilUsecase,
  AtualizarImagemPerfilUsecase,
];

@Module({
  imports: [CommonModule, EnderecosModule],
  controllers: [UsuariosController, AuthController],
  providers: [
    { provide: UsuarioRepository, useClass: PostgresUsuarioRepository },
    { provide: HashPort, useClass: ScryptHashAdapter },
    ...SERVICES,
  ],
  exports: [],
})
export class UsuariosModule {}
