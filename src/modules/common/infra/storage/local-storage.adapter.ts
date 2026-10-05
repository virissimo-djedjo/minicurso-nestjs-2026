import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { StoragePort } from '../../application/ports/storage.port';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

export class LocalStorageAdapter implements StoragePort {
  public async upload(key: string, imagem: Buffer): Promise<string> {
    const path = join(UPLOADS_ROOT, key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, imagem);
    return `/uploads/${key}`;
  }
}
