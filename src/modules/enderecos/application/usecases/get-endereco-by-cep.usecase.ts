import { Injectable } from '@nestjs/common';
import { CachePort } from '../../../common/application/ports/cache.port';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { Cep } from '../../domain/value-objects/cep';
import { EnderecoDto } from '../dto/endereco.dto';
import { CepProviderPort } from '../ports/cep-provider.port';
import { EnderecoRepository } from '../repositories/endereco.repository';

@Injectable()
export class GetEnderecoByCepUsecase {
  constructor(
    private readonly cachePort: CachePort,
    private readonly enderecoRepository: EnderecoRepository,
    private readonly cepProviderPort: CepProviderPort,
  ) {}

  public async execute(value: string): Promise<EnderecoDto> {
    const cep = new Cep(value).getCep();
    const cacheKey = `endereco:${cep}`;
    const cachedEndereco = await this.cachePort.get<EnderecoDto>(cacheKey);
    if (cachedEndereco) {
      return cachedEndereco;
    }
    const endereco =
      (await this.enderecoRepository.getEnderecoByCep(cep)) ??
      (await this.saveEnderecoFromCepProvider(cep));
    await this.cachePort.set(cacheKey, endereco);
    return endereco;
  }

  private async saveEnderecoFromCepProvider(cep: string): Promise<EnderecoDto> {
    const endereco = await this.cepProviderPort.getEnderecoByCep(cep);
    if (!endereco) {
      throw new DomainException(DOMAIN_EXCEPTION.CEP.NAO_ENCONTRADO.message, {
        cause: DOMAIN_EXCEPTION.CEP.NAO_ENCONTRADO.domainCode,
      });
    }
    return this.enderecoRepository.save(endereco);
  }
}
