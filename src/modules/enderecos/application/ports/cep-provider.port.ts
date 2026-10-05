import { CreateEnderecoDto } from '../dto/endereco.dto';

export abstract class CepProviderPort {
  abstract getEnderecoByCep(cep: string): Promise<CreateEnderecoDto | null>;
}
