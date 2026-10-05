import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';

export class Email {
  private readonly email: string;
  private static readonly FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    const normalizedEmail = value.trim().toLowerCase();
    if (!Email.FORMAT.test(normalizedEmail)) {
      throw new DomainException(DOMAIN_EXCEPTION.EMAIL.INVALID.message, {
        cause: DOMAIN_EXCEPTION.EMAIL.INVALID.domainCode,
      });
    }
    this.email = normalizedEmail;
  }

  public getEmail(): string {
    return this.email;
  }
}
