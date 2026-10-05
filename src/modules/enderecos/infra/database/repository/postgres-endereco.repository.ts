import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { EnderecoRepository } from '../../../application/repositories/endereco.repository';
import {
  CreateEnderecoDto,
  EnderecoDto,
} from '../../../application/dto/endereco.dto';

@Injectable()
export class PostgresEnderecoRepository implements EnderecoRepository {
  constructor(@Inject(Sequelize) private readonly sequelize: Sequelize) {}

  public async getEnderecoByCep(cep: string): Promise<EnderecoDto | null> {
    const sql = `
        SELECT id,
               cep,
               logradouro,
               bairro,
               cidade,
               estado
          FROM endereco
         WHERE cep = $1
           AND deleted_at IS NULL
         ORDER BY id
         LIMIT 1
      `;
    const [endereco] = await this.sequelize.query<EnderecoDto>(sql, {
      bind: [cep],
      type: QueryTypes.SELECT,
    });
    return endereco ?? null;
  }

  public async save(endereco: CreateEnderecoDto): Promise<EnderecoDto> {
    const sql = `
        INSERT INTO endereco (cep, logradouro, bairro, cidade, estado)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, cep, logradouro, bairro, cidade, estado
      `;
    const [enderecoSalvo] = await this.sequelize.query<EnderecoDto>(sql, {
      bind: [
        endereco.cep,
        endereco.logradouro,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
      ],
      type: QueryTypes.SELECT,
    });
    return enderecoSalvo;
  }
}
