import { Injectable, Logger } from '@nestjs/common';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { CepProviderPort } from '../../application/ports/cep-provider.port';
import { CreateEnderecoDto } from '../../application/dto/endereco.dto';
import { ViaCepResponseDto } from './via-cep.dto';

const VIA_CEP_URL = 'https://viacep.com.br/ws';

@Injectable()
export class ViaCepAdapter implements CepProviderPort {
  private readonly logger = new Logger(ViaCepAdapter.name);

  public async getEnderecoByCep(
    cep: string,
  ): Promise<CreateEnderecoDto | null> {
    const viaCepEndereco = await this.getViaCepResponse(cep);
    if (viaCepEndereco.erro) {
      return null;
    }
    return {
      cep,
      logradouro: viaCepEndereco.logradouro || null,
      bairro: viaCepEndereco.bairro || null,
      cidade: viaCepEndereco.localidade || null,
      estado: viaCepEndereco.uf || null,
    };
  }

  private async getViaCepResponse(cep: string): Promise<ViaCepResponseDto> {
    try {
      const response = await fetch(`${VIA_CEP_URL}/${cep}/json/`);
      if (!response.ok) {
        throw new Error(`ViaCEP respondeu ${response.status}`);
      }
      return (await response.json()) as ViaCepResponseDto;
    } catch (error) {
      this.logger.error(`Falha ao consultar o CEP ${cep} no ViaCEP`, error);
      throw new DomainException(
        DOMAIN_EXCEPTION.CEP.SERVICO_INDISPONIVEL.message,
        { cause: DOMAIN_EXCEPTION.CEP.SERVICO_INDISPONIVEL.domainCode },
      );
    }
  }
}
