import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { UsuarioModel } from '../../../domain/entity/usuario.entity';
import UsuarioDBEntity from '../entity/usuario.db.entity';

@Injectable()
export default class UsuarioRepository {
  constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}

  public async searchUsuarioByNomeUsuario(
    username: string,
  ): Promise<UsuarioModel[]> {
    const sql = `
        SELECT *
          FROM usuario u
         WHERE u.nome_usuario ILIKE :username
           AND u.deleted_at IS NULL
      `;
    const result = await this.sequelize.query(sql, {
      replacements: { username: `%${username}%` },
      type: QueryTypes.SELECT,
      mapToModel: true,
      model: UsuarioDBEntity,
    });
    return result.map((usuario: UsuarioDBEntity) => usuario.get());
  }
}
