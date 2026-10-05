export abstract class StoragePort {
  abstract upload(
    key: string,
    imagem: Buffer,
    contentType: string,
  ): Promise<string>;
}
