import { Module } from '@nestjs/common';
import { UsuariosController } from './infra/presentation/http/usuarios.controller';
import SearchUsuarioService from './infra/presentation/application/services/search-usuario.service';
import { SequelizeModule } from '@nestjs/sequelize';
import UsuarioDBEntity from './infra/presentation/database/entity/usuario.db.entity';
import UsuarioRepository from './infra/presentation/database/repository/usuario.repository';

const SERVICES = [SearchUsuarioService];

@Module({
  imports: [SequelizeModule.forFeature([UsuarioDBEntity])],
  controllers: [UsuariosController],
  providers: [UsuarioRepository, ...SERVICES],
  exports: [],
})
export class UsuariosModule {}
