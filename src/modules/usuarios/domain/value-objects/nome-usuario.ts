import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';

export class NomeUsuario {
  private readonly nomeUsuario: string;
  private static readonly FORMAT = /^[a-z0-9_.]{3,35}$/;

  constructor(value: string) {
    const normalizedNomeUsuario = value.trim().toLowerCase();
    if (!NomeUsuario.FORMAT.test(normalizedNomeUsuario)) {
      throw new DomainException(
        DOMAIN_EXCEPTION.NOME_USUARIO.INVALID.message,
        { cause: DOMAIN_EXCEPTION.NOME_USUARIO.INVALID.domainCode },
      );
    }
    this.nomeUsuario = normalizedNomeUsuario;
  }

  public getNomeUsuario(): string {
    return this.nomeUsuario;
  }
}
