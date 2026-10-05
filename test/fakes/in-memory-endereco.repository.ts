import {
  CreateEnderecoDto,
  EnderecoDto,
} from '../../src/modules/enderecos/application/dto/endereco.dto';
import { EnderecoRepository } from '../../src/modules/enderecos/application/repositories/endereco.repository';
import { EnderecoRow } from './fakes.dto';

export class InMemoryEnderecoRepository implements EnderecoRepository {
  readonly enderecos = new Map<string, EnderecoRow>();

  public async getEnderecoByCep(cep: string): Promise<EnderecoDto | null> {
    const row = [...this.enderecos.values()].find(
      (endereco) => endereco.cep === cep && !endereco.deletedAt,
    );
    if (!row) {
      return null;
    }
    const { deletedAt: _deletedAt, ...endereco } = row;
    return endereco;
  }

  public async save(endereco: CreateEnderecoDto): Promise<EnderecoDto> {
    const enderecoSalvo = { id: String(this.enderecos.size + 1), ...endereco };
    this.enderecos.set(enderecoSalvo.id, { ...enderecoSalvo, deletedAt: null });
    return enderecoSalvo;
  }
}
