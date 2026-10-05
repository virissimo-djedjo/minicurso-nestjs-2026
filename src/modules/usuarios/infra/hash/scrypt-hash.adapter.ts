import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { HashPort } from '../../application/ports/hash.port';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

@Injectable()
export class ScryptHashAdapter implements HashPort {
  public async hash(senha: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);
    const hash = await this.buildHash(senha, salt);
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
  }

  public async compare(senha: string, senhaHash: string): Promise<boolean> {
    const [salt, hash] = senhaHash.split(':');
    const candidateHash = await this.buildHash(senha, Buffer.from(salt, 'hex'));
    return timingSafeEqual(candidateHash, Buffer.from(hash, 'hex'));
  }

  private buildHash(senha: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(senha, salt, KEY_LENGTH, (error, hash) =>
        error ? reject(error) : resolve(hash),
      );
    });
  }
}
