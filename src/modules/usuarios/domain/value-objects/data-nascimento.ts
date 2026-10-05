import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';

export class DataNascimento {
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;
  private static readonly MINIMUM_AGE = 16;
  private static readonly ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

  constructor(value: string | Date) {
    if (!value) {
      throw new DomainException(
        DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.message,
        {
          cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.domainCode,
        },
      );
    }
    const { year, month, day } = this.normalize(value);
    if (!this.isRealDate(year, month, day)) {
      throw new DomainException(
        DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.message,
        {
          cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.domainCode,
        },
      );
    }
    this.year = year;
    this.month = month;
    this.day = day;
    if (this.isInTheFuture()) {
      throw new DomainException(
        DOMAIN_EXCEPTION.DATA_NASCIMENTO.VALOR_FUTURO.message,
        {
          cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.VALOR_FUTURO.domainCode,
        },
      );
    }
    if (this.getIdade() < DataNascimento.MINIMUM_AGE) {
      throw new DomainException(
        DOMAIN_EXCEPTION.DATA_NASCIMENTO.IDADE_MINIMA.message,
        {
          cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.IDADE_MINIMA.domainCode,
        },
      );
    }
  }

  public getDataNascimento(formatted: boolean = false): string {
    if (formatted) {
      return this.getDataNascimentoFormatted();
    }
    return `${this.pad(this.year, 4)}-${this.pad(this.month)}-${this.pad(this.day)}`;
  }

  public getIdade(): number {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const age = currentYear - this.year;
    if (
      currentMonth < this.month ||
      (currentMonth === this.month && currentDay < this.day)
    ) {
      return age - 1;
    }
    return age;
  }

  public toDate(): Date {
    return new Date(Date.UTC(this.year, this.month - 1, this.day));
  }

  private getDataNascimentoFormatted(): string {
    return `${this.pad(this.day)}/${this.pad(this.month)}/${this.pad(this.year, 4)}`;
  }

  private normalize(value: string | Date): {
    year: number;
    month: number;
    day: number;
  } {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new DomainException(
          DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.message,
          {
            cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.domainCode,
          },
        );
      }
      return {
        year: value.getUTCFullYear(),
        month: value.getUTCMonth() + 1,
        day: value.getUTCDate(),
      };
    }
    const match = DataNascimento.ISO_DATE.exec(value.trim());
    if (!match) {
      throw new DomainException(
        DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.message,
        { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.domainCode },
      );
    }
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
    };
  }

  private isRealDate(year: number, month: number, day: number): boolean {
    if (month < 1 || month > 12 || day < 1) {
      return false;
    }
    return day <= this.getDaysInMonth(year, month);
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }

  private isInTheFuture(): boolean {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    if (this.year !== currentYear) {
      return this.year > currentYear;
    }
    if (this.month !== currentMonth) {
      return this.month > currentMonth;
    }
    return this.day > currentDay;
  }

  private pad(value: number, length: number = 2): string {
    return String(value).padStart(length, '0');
  }
}
