import sharp, { ResizeOptions } from 'sharp';
import { DOMAIN_EXCEPTION, DomainException } from '../../domain/exception';

export async function convertImagemToWebp(
  imagem: Buffer,
  resizeOptions: ResizeOptions,
): Promise<Buffer> {
  try {
    return await sharp(imagem).rotate().resize(resizeOptions).webp().toBuffer();
  } catch {
    throw new DomainException(DOMAIN_EXCEPTION.IMAGEM.TIPO_INVALIDO.message, {
      cause: DOMAIN_EXCEPTION.IMAGEM.TIPO_INVALIDO.domainCode,
    });
  }
}
