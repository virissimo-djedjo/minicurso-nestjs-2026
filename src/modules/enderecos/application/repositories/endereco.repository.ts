import { CreateEnderecoDto, EnderecoDto } from '../dto/endereco.dto';

export abstract class EnderecoRepository {
  abstract getEnderecoByCep(cep: string): Promise<EnderecoDto | null>;

  abstract save(endereco: CreateEnderecoDto): Promise<EnderecoDto>;
}
