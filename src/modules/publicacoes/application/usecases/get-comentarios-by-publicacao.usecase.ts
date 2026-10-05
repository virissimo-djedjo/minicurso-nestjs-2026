import { Injectable } from '@nestjs/common';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { ComentarioDto } from '../dto/comentario.dto';
import { ComentarioRepository } from '../repositories/comentario.repository';
import { PublicacaoRepository } from '../repositories/publicacao.repository';

@Injectable()
export class GetComentariosByPublicacaoUsecase {
  constructor(
    private readonly publicacaoRepository: PublicacaoRepository,
    private readonly comentarioRepository: ComentarioRepository,
  ) {}

  public async execute(publicacaoId: number): Promise<ComentarioDto[]> {
    if (!(await this.publicacaoRepository.hasPublicacao(publicacaoId))) {
      throw new DomainException(
        DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
        { cause: DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.domainCode },
      );
    }
    return this.comentarioRepository.getComentariosByPublicacaoId(publicacaoId);
  }
}
