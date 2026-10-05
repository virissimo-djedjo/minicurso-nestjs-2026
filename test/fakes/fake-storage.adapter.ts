import { StoragePort } from '../../src/modules/common/application/ports/storage.port';
import { StoredFileRow } from './fakes.dto';

export class FakeStorageAdapter implements StoragePort {
  readonly files = new Map<string, StoredFileRow>();

  public async upload(
    key: string,
    imagem: Buffer,
    contentType: string,
  ): Promise<string> {
    this.files.set(key, { imagem, contentType });
    return `/uploads/${key}`;
  }
}
