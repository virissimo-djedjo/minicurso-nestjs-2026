import {
  DomainException,
  DOMAIN_EXCEPTION,
} from '../../../common/domain/exception';

export class CPF {
  private cpf: string;
  private readonly CPF_LENGTH = 11;
  constructor(value: string | number) {
    if (!value) {
      throw new DomainException(DOMAIN_EXCEPTION.CPF.INVALID.message, {
        cause: DOMAIN_EXCEPTION.CPF.INVALID.domainCode,
      });
    }
    const normalizedCpf = this.normalize(value);
    if (!this.validate(normalizedCpf)) {
      throw new DomainException(DOMAIN_EXCEPTION.CPF.FALHA_VALIDACAO.message, {
        cause: DOMAIN_EXCEPTION.CPF.FALHA_VALIDACAO.domainCode,
      });
    }
    this.cpf = normalizedCpf;
  }
  public getCpf(formatted: boolean = false): string {
    if (formatted) {
      return this.getCpfFormatted();
    }
    return this.cpf;
  }
  private getCpfFormatted(): string {
    return this.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  private normalize(value: string | number): string {
    const digits = String(value).replace(/[^\d]/g, '');
    if (typeof value === 'number') {
      return digits.padStart(this.CPF_LENGTH, '0');
    }
    return digits;
  }
  private validate(cpf: string): boolean {
    this.hasInvalidLength(cpf);
    this.isBlackListed(cpf);

    const digits = cpf.split('').map(Number);
    const baseDigits = digits.slice(0, 9);
    const firstVerifier = this.calculateVerifierDigit(baseDigits);
    const secondVerifier = this.calculateVerifierDigit([
      ...baseDigits,
      firstVerifier,
    ]);
    const actualFirstVerifier = digits[9];
    const actualSecondVerifier = digits[10];
    return (
      firstVerifier === actualFirstVerifier &&
      secondVerifier === actualSecondVerifier
    );
  }
  private hasInvalidLength(cpf: string): boolean {
    if (cpf.length === this.CPF_LENGTH) return true;
    throw new DomainException(DOMAIN_EXCEPTION.CPF.INVALID_LENGTH.message, {
      cause: DOMAIN_EXCEPTION.CPF.INVALID_LENGTH.domainCode,
    });
  }
  private isBlackListed(cpf: string): boolean {
    const blackListRegex = /^(\d)\1+$/;
    if (blackListRegex.test(cpf)) {
      throw new DomainException(DOMAIN_EXCEPTION.CPF.FALHA_VALIDACAO.message, {
        cause: DOMAIN_EXCEPTION.CPF.FALHA_VALIDACAO.domainCode,
      });
    }
    return false;
  }
  private calculateVerifierDigit(digits: number[]): number {
    const initialWeight = digits.length + 1;
    const sum = digits.reduce((accumulator, currentDigit, index) => {
      const weight = initialWeight - index;
      return accumulator + currentDigit * weight;
    }, 0);
    const remainder = (sum * 10) % 11;
    return remainder >= 10 ? 0 : remainder;
  }
}
