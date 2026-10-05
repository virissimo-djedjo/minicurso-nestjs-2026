import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DOMAIN_EXCEPTION, DomainException } from '../../domain/exception';

const S3_REGION = 'us-east-1';

export class S3StorageAdapter {
  private readonly logger = new Logger(S3StorageAdapter.name);
  private readonly client: S3Client;
  private readonly endpoint: string;
  private readonly bucket: string;

  constructor(configService: ConfigService) {
    this.endpoint = configService.getOrThrow<string>('storage.s3.endpoint');
    this.bucket = configService.getOrThrow<string>('storage.s3.bucket');
    this.client = new S3Client({
      endpoint: this.endpoint,
      region: S3_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: configService.getOrThrow<string>('storage.s3.accessKeyId'),
        secretAccessKey: configService.getOrThrow<string>(
          'storage.s3.secretAccessKey',
        ),
      },
    });
  }

  public async upload(
    key: string,
    imagem: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: imagem,
          ContentType: contentType,
        }),
      );
    } catch (error) {
      this.logger.error(`Falha ao enviar ${key} para o bucket`, error);
      throw new DomainException(DOMAIN_EXCEPTION.STORAGE.INDISPONIVEL.message, {
        cause: DOMAIN_EXCEPTION.STORAGE.INDISPONIVEL.domainCode,
      });
    }
    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}
