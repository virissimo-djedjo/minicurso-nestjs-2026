import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

export class LocalStorageAdapter {
  public async upload(key: string, imagem: Buffer): Promise<string> {
    const path = join(UPLOADS_ROOT, key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, imagem);
    return `/uploads/${key}`;
  }
}
