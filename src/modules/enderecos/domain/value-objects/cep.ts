import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';

export class Cep {
  private readonly cep: string;
  private static readonly FORMAT = /^\d{8}$/;

  constructor(value: string) {
    const normalizedCep = value.trim().replace('-', '');
    if (!Cep.FORMAT.test(normalizedCep)) {
      throw new DomainException(DOMAIN_EXCEPTION.CEP.INVALID.message, {
        cause: DOMAIN_EXCEPTION.CEP.INVALID.domainCode,
      });
    }
    this.cep = normalizedCep;
  }

  public getCep(): string {
    return this.cep;
  }
}
