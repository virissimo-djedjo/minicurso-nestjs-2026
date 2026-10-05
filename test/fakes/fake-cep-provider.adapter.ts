import { CreateEnderecoDto } from '../../src/modules/enderecos/application/dto/endereco.dto';
import { CepProviderPort } from '../../src/modules/enderecos/application/ports/cep-provider.port';

export class FakeCepProviderAdapter implements CepProviderPort {
  readonly enderecos = new Map<string, CreateEnderecoDto>();

  public async getEnderecoByCep(
    cep: string,
  ): Promise<CreateEnderecoDto | null> {
    return this.enderecos.get(cep) ?? null;
  }
}
