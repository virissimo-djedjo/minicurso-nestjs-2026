import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { SearchUsuarioResultDto } from '../../../application/dto/search-usuario.dto';

@Injectable()
export default class UsuarioRepository {
  constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}

  public async searchUsuarioByNomeUsuario(
    username: string,
  ): Promise<SearchUsuarioResultDto[]> {
    const sql = `
        SELECT id,
               nome,
               sobrenome,
               nome_usuario AS "nomeUsuario",
               imagem_perfil_url AS "imagemPerfilUrl"
          FROM usuario
         WHERE nome_usuario ILIKE '%' || $1 || '%'
           AND deleted_at IS NULL
      `;
    return this.sequelize.query<SearchUsuarioResultDto>(sql, {
      bind: [username.replace(/[\\%_]/g, '\\$&')],
      type: QueryTypes.SELECT,
    });
  }
}
