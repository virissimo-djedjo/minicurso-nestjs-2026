import { Injectable } from '@nestjs/common';
import { ResizeOptions } from 'sharp';
import { StoragePort } from '../../../common/application/ports/storage.port';
import { convertImagemToWebp } from '../../../common/application/utils/imagem.util';
import { ImagemPerfilDto } from '../dto/atualizar-imagem-perfil.dto';
import { UsuarioRepository } from '../repositories/usuario.repository';

const PERFIL_RESIZE: ResizeOptions = { width: 512, height: 512, fit: 'cover' };

@Injectable()
export class AtualizarImagemPerfilUsecase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly storagePort: StoragePort,
  ) {}

  public async execute(
    usuarioId: string,
    imagem: Buffer,
  ): Promise<ImagemPerfilDto> {
    const imagemWebp = await convertImagemToWebp(imagem, PERFIL_RESIZE);
    const imagemPerfilUrl = await this.storagePort.upload(
      `usuarios/${usuarioId}/perfil-${Date.now()}.webp`,
      imagemWebp,
      'image/webp',
    );
    await this.usuarioRepository.updateImagemPerfilUrl(
      usuarioId,
      imagemPerfilUrl,
    );
    return { imagemPerfilUrl };
  }
}
