import { HashPort } from '../../src/modules/usuarios/application/ports/hash.port';

export class FakeHashAdapter implements HashPort {
  public async hash(senha: string): Promise<string> {
    return `hash:${senha}`;
  }

  public async compare(senha: string, senhaHash: string): Promise<boolean> {
    return senhaHash === `hash:${senha}`;
  }
}
