import { Injectable } from '@nestjs/common';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { PublicacaoRepository } from '../repositories/publicacao.repository';

@Injectable()
export class ExcluirPublicacaoUsecase {
  constructor(private readonly publicacaoRepository: PublicacaoRepository) {}

  public async execute(publicacaoId: number): Promise<void> {
    if (!(await this.publicacaoRepository.deletePublicacaoById(publicacaoId))) {
      throw new DomainException(
        DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
        { cause: DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.domainCode },
      );
    }
  }
}
