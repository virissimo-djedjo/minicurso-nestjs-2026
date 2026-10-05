import { PayloadTooLargeException } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';

export const MAX_IMAGEM_SIZE = 10 * 1024 * 1024;

const FILE_TOO_LARGE_CODE = 'FST_REQ_FILE_TOO_LARGE';

export async function getFileBuffer(file: MultipartFile): Promise<Buffer> {
  try {
    return await file.toBuffer();
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === FILE_TOO_LARGE_CODE
    ) {
      throw new PayloadTooLargeException('A imagem deve ter no máximo 10MB.');
    }
    throw error;
  }
}
