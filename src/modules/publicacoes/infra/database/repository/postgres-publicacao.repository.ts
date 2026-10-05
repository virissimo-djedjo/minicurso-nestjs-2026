import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { PublicacaoRepository } from '../../../application/repositories/publicacao.repository';
import {
  CreatePublicacaoDto,
  PublicacaoAutorDto,
  PublicacaoCheckDto,
  PublicacaoDto,
} from '../../../application/dto/publicacao.dto';

@Injectable()
export class PostgresPublicacaoRepository implements PublicacaoRepository {
  constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}

  public async save(publicacao: CreatePublicacaoDto): Promise<PublicacaoDto> {
    const sql = `
        WITH publicacao_criada AS (
             INSERT INTO publicacao (usuario_id, conteudo, imagem_url, status)
             VALUES ($1, $2, $3, 'PUBLICADA')
             RETURNING id, usuario_id, conteudo, imagem_url, created_at
        )
        SELECT publicacao_criada.id,
               publicacao_criada.conteudo,
               publicacao_criada.imagem_url AS "imagemUrl",
               publicacao_criada.created_at AS "createdAt",
               json_build_object(
                 'id', autor.id::text,
                 'nomeUsuario', autor.nome_usuario,
                 'imagemPerfilUrl', autor.imagem_perfil_url
               ) AS autor
          FROM publicacao_criada
          JOIN usuario AS autor
            ON autor.id = publicacao_criada.usuario_id
           AND autor.deleted_at IS NULL
      `;
    const [publicacaoCriada] = await this.sequelize.query<PublicacaoDto>(sql, {
      bind: [publicacao.usuarioId, publicacao.conteudo, publicacao.imagemUrl],
      type: QueryTypes.SELECT,
    });
    return publicacaoCriada;
  }

  public async getFeed(page: number, limit: number): Promise<PublicacaoDto[]> {
    const sql = `
        SELECT publicacao.id,
               publicacao.conteudo,
               publicacao.imagem_url AS "imagemUrl",
               publicacao.created_at AS "createdAt",
               json_build_object(
                 'id', autor.id::text,
                 'nomeUsuario', autor.nome_usuario,
                 'imagemPerfilUrl', autor.imagem_perfil_url
               ) AS autor
          FROM publicacao
          JOIN usuario AS autor
            ON autor.id = publicacao.usuario_id
           AND autor.deleted_at IS NULL
         WHERE publicacao.deleted_at IS NULL
         ORDER BY publicacao.created_at DESC, publicacao.id DESC
         LIMIT $2
        OFFSET ($1 - 1) * $2
      `;
    return this.sequelize.query<PublicacaoDto>(sql, {
      bind: [page, limit],
      type: QueryTypes.SELECT,
    });
  }

  public async hasPublicacao(publicacaoId: number): Promise<boolean> {
    const sql = `
        SELECT EXISTS (
               SELECT 1
                 FROM publicacao
                WHERE id = $1
                  AND deleted_at IS NULL
               ) AS "hasPublicacao"
      `;
    const [check] = await this.sequelize.query<PublicacaoCheckDto>(sql, {
      bind: [publicacaoId],
      type: QueryTypes.SELECT,
    });
    return check.hasPublicacao;
  }

  public async getAutorIdById(publicacaoId: number): Promise<string | null> {
    const sql = `
        SELECT usuario_id AS "autorId"
          FROM publicacao
         WHERE id = $1
           AND deleted_at IS NULL
      `;
    const [publicacao] = await this.sequelize.query<PublicacaoAutorDto>(sql, {
      bind: [publicacaoId],
      type: QueryTypes.SELECT,
    });
    return publicacao?.autorId ?? null;
  }

  public async deletePublicacaoById(publicacaoId: number): Promise<boolean> {
    const sql = `
        UPDATE publicacao
           SET deleted_at = now(),
               updated_at = now()
         WHERE id = $1
           AND deleted_at IS NULL
        RETURNING id
      `;
    const deletedPublicacoes = await this.sequelize.query(sql, {
      bind: [publicacaoId],
      type: QueryTypes.SELECT,
    });
    return deletedPublicacoes.length > 0;
  }
}
