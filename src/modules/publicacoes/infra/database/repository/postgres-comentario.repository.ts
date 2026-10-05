import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { ComentarioRepository } from '../../../application/repositories/comentario.repository';
import {
  ComentarioDto,
  CreateComentarioDto,
} from '../../../application/dto/comentario.dto';

@Injectable()
export class PostgresComentarioRepository implements ComentarioRepository {
  constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}

  public async save(
    comentario: CreateComentarioDto,
  ): Promise<ComentarioDto | null> {
    const sql = `
        WITH comentario_criado AS (
             INSERT INTO comentario (publicacao_id, usuario_id, conteudo)
             SELECT publicacao.id, $2, $3
               FROM publicacao
              WHERE publicacao.id = $1
                AND publicacao.deleted_at IS NULL
             RETURNING id, publicacao_id, usuario_id, conteudo, created_at
        )
        SELECT comentario_criado.id,
               comentario_criado.publicacao_id::text AS "publicacaoId",
               comentario_criado.conteudo,
               comentario_criado.created_at AS "createdAt",
               json_build_object(
                 'id', autor.id::text,
                 'nomeUsuario', autor.nome_usuario,
                 'imagemPerfilUrl', autor.imagem_perfil_url
               ) AS autor
          FROM comentario_criado
          JOIN usuario AS autor
            ON autor.id = comentario_criado.usuario_id
           AND autor.deleted_at IS NULL
      `;
    const [comentarioCriado] = await this.sequelize.query<ComentarioDto>(sql, {
      bind: [comentario.publicacaoId, comentario.usuarioId, comentario.conteudo],
      type: QueryTypes.SELECT,
    });
    return comentarioCriado ?? null;
  }

  public async getComentariosByPublicacaoId(
    publicacaoId: number,
  ): Promise<ComentarioDto[]> {
    const sql = `
        SELECT comentario.id,
               comentario.publicacao_id::text AS "publicacaoId",
               comentario.conteudo,
               comentario.created_at AS "createdAt",
               json_build_object(
                 'id', autor.id::text,
                 'nomeUsuario', autor.nome_usuario,
                 'imagemPerfilUrl', autor.imagem_perfil_url
               ) AS autor
          FROM comentario
          JOIN usuario AS autor
            ON autor.id = comentario.usuario_id
           AND autor.deleted_at IS NULL
         WHERE comentario.publicacao_id = $1
           AND comentario.deleted_at IS NULL
         ORDER BY comentario.created_at ASC, comentario.id ASC
      `;
    return this.sequelize.query<ComentarioDto>(sql, {
      bind: [publicacaoId],
      type: QueryTypes.SELECT,
    });
  }
}
