import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes, UniqueConstraintError } from 'sequelize';
import { SearchUsuarioResultDto } from '../../../application/dto/search-usuario.dto';
import {
  UsuarioCadastradoCheckDto,
  UsuarioCadastradoDto,
} from '../../../application/dto/cadastrar-usuario.dto';
import { UsuarioRepository } from '../../../application/repositories/usuario.repository';
import { CredencialUsuarioDto } from '../../../application/dto/autenticar-usuario.dto';
import { PerfilUsuarioDto } from '../../../application/dto/perfil-usuario.dto';
import { Usuario } from '../../../domain/entity/usuario.entity';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../../common/domain/exception';

@Injectable()
export class PostgresUsuarioRepository implements UsuarioRepository {
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

  public async hasUsuarioCadastrado(usuario: Usuario): Promise<boolean> {
    const sql = `
        SELECT EXISTS (
               SELECT 1
                 FROM usuario
                WHERE (cpf = $1 OR email = $2 OR nome_usuario = $3)
                  AND deleted_at IS NULL
               ) AS "isCadastrado"
      `;
    const [check] = await this.sequelize.query<UsuarioCadastradoCheckDto>(sql, {
      bind: [
        usuario.cpf.getCpf(),
        usuario.email.getEmail(),
        usuario.nomeUsuario.getNomeUsuario(),
      ],
      type: QueryTypes.SELECT,
    });
    return check.isCadastrado;
  }

  public async save(usuario: Usuario): Promise<UsuarioCadastradoDto> {
    const sql = `
        INSERT INTO usuario (nome, sobrenome, nome_usuario, email, senha_hash, cpf, data_nascimento, status, endereco_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id,
                  nome,
                  sobrenome,
                  nome_usuario AS "nomeUsuario",
                  email,
                  to_char(data_nascimento, 'YYYY-MM-DD') AS "dataNascimento",
                  status
      `;
    try {
      const [usuarioCadastrado] =
        await this.sequelize.query<UsuarioCadastradoDto>(sql, {
          bind: [
            usuario.nome,
            usuario.sobrenome,
            usuario.nomeUsuario.getNomeUsuario(),
            usuario.email.getEmail(),
            usuario.senhaHash,
            usuario.cpf.getCpf(),
            usuario.dataNascimento.getDataNascimento(),
            usuario.status,
            usuario.enderecoId,
          ],
          type: QueryTypes.SELECT,
        });
      return usuarioCadastrado;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new DomainException(
          DOMAIN_EXCEPTION.USUARIO.JA_CADASTRADO.message,
          { cause: DOMAIN_EXCEPTION.USUARIO.JA_CADASTRADO.domainCode },
        );
      }
      throw error;
    }
  }

  public async getCredencialByEmail(
    email: string,
  ): Promise<CredencialUsuarioDto | null> {
    const sql = `
        SELECT id,
               nome_usuario AS "nomeUsuario",
               senha_hash AS "senhaHash",
               status
          FROM usuario
         WHERE email = $1
           AND deleted_at IS NULL
      `;
    const [credencial] = await this.sequelize.query<CredencialUsuarioDto>(
      sql,
      { bind: [email], type: QueryTypes.SELECT },
    );
    return credencial ?? null;
  }

  public async getPerfilById(
    usuarioId: string,
  ): Promise<PerfilUsuarioDto | null> {
    const sql = `
        SELECT usuario.id,
               usuario.nome,
               usuario.sobrenome,
               usuario.nome_usuario AS "nomeUsuario",
               usuario.email,
               usuario.imagem_perfil_url AS "imagemPerfilUrl",
               CASE
                 WHEN endereco.id IS NULL THEN NULL
                 ELSE json_build_object(
                   'cep', endereco.cep,
                   'logradouro', endereco.logradouro,
                   'bairro', endereco.bairro,
                   'cidade', endereco.cidade,
                   'estado', endereco.estado
                 )
               END AS endereco
          FROM usuario
          LEFT JOIN endereco
            ON endereco.id = usuario.endereco_id
           AND endereco.deleted_at IS NULL
         WHERE usuario.id = $1
           AND usuario.deleted_at IS NULL
      `;
    const [perfil] = await this.sequelize.query<PerfilUsuarioDto>(sql, {
      bind: [usuarioId],
      type: QueryTypes.SELECT,
    });
    return perfil ?? null;
  }

  public async updateImagemPerfilUrl(
    usuarioId: string,
    imagemPerfilUrl: string,
  ): Promise<void> {
    const sql = `
        UPDATE usuario
           SET imagem_perfil_url = $2,
               updated_at = now()
         WHERE id = $1
           AND deleted_at IS NULL
      `;
    await this.sequelize.query(sql, {
      bind: [usuarioId, imagemPerfilUrl],
      type: QueryTypes.UPDATE,
    });
  }
}
