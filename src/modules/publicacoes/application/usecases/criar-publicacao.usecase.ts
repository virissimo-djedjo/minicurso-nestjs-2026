import { Injectable } from '@nestjs/common';
import { ResizeOptions } from 'sharp';
import { StoragePort } from '../../../common/application/ports/storage.port';
import { convertImagemToWebp } from '../../../common/application/utils/imagem.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import {
  CriarPublicacaoDto,
  MAX_CONTEUDO_LENGTH,
  PublicacaoDto,
} from '../dto/publicacao.dto';
import { PublicacaoRepository } from '../repositories/publicacao.repository';

const PUBLICACAO_RESIZE: ResizeOptions = {
  width: 1080,
  height: 1080,
  fit: 'inside',
  withoutEnlargement: true,
};

@Injectable()
export class CriarPublicacaoUsecase {
  constructor(
    private readonly publicacaoRepository: PublicacaoRepository,
    private readonly storagePort: StoragePort,
  ) {}

  public async execute(
    usuarioId: string,
    dados: CriarPublicacaoDto,
  ): Promise<PublicacaoDto> {
    const conteudo = dados.conteudo?.trim() || null;
    if (!conteudo && !dados.imagem) {
      throw new DomainException(DOMAIN_EXCEPTION.PUBLICACAO.VAZIA.message, {
        cause: DOMAIN_EXCEPTION.PUBLICACAO.VAZIA.domainCode,
      });
    }
    if (conteudo && conteudo.length > MAX_CONTEUDO_LENGTH) {
      throw new DomainException(
        DOMAIN_EXCEPTION.PUBLICACAO.CONTEUDO_LONGO.message,
        { cause: DOMAIN_EXCEPTION.PUBLICACAO.CONTEUDO_LONGO.domainCode },
      );
    }
    const imagemUrl = dados.imagem
      ? await this.uploadImagem(usuarioId, dados.imagem)
      : null;
    return this.publicacaoRepository.save({ usuarioId, conteudo, imagemUrl });
  }

  private async uploadImagem(
    usuarioId: string,
    imagem: Buffer,
  ): Promise<string> {
    const imagemWebp = await convertImagemToWebp(imagem, PUBLICACAO_RESIZE);
    return this.storagePort.upload(
      `publicacoes/${usuarioId}/${Date.now()}.webp`,
      imagemWebp,
      'image/webp',
    );
  }
}
