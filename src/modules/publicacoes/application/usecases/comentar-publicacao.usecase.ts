import { Injectable } from '@nestjs/common';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { ComentarioDto, ComentarPublicacaoDto } from '../dto/comentario.dto';
import { ComentarioRepository } from '../repositories/comentario.repository';

@Injectable()
export class ComentarPublicacaoUsecase {
  constructor(private readonly comentarioRepository: ComentarioRepository) {}

  public async execute(
    publicacaoId: number,
    usuarioId: string,
    dados: ComentarPublicacaoDto,
  ): Promise<ComentarioDto> {
    const conteudo = dados.conteudo.trim();
    if (!conteudo) {
      throw new DomainException(DOMAIN_EXCEPTION.COMENTARIO.VAZIO.message, {
        cause: DOMAIN_EXCEPTION.COMENTARIO.VAZIO.domainCode,
      });
    }
    const comentario = await this.comentarioRepository.save({
      publicacaoId,
      usuarioId,
      conteudo,
    });
    if (!comentario) {
      throw new DomainException(
        DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
        { cause: DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.domainCode },
      );
    }
    return comentario;
  }
}
