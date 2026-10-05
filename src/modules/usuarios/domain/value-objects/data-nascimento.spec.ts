import { catchError } from '../../../../../test/utils/catch-error.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { DataNascimento } from './data-nascimento';

function makeDataNascimento(yearsAgo: number, daysOffset = 0): string {
  const today = new Date();
  const date = new Date(
    today.getFullYear() - yearsAgo,
    today.getMonth(),
    today.getDate() + daysOffset,
  );
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

describe('DataNascimento', () => {
  it('Deve guardar a data nos formatos ISO e brasileiro quando a pessoa tem mais de 16 anos', () => {
    const value = '2000-05-10';

    const dataNascimento = new DataNascimento(value);

    expect(dataNascimento.getDataNascimento()).toBe('2000-05-10');
    expect(dataNascimento.getDataNascimento(true)).toBe('10/05/2000');
  });

  it('Deve aceitar a data quando a pessoa faz 16 anos hoje', () => {
    const value = makeDataNascimento(16);

    const dataNascimento = new DataNascimento(value);

    expect(dataNascimento.getIdade()).toBe(16);
  });

  it('Deve recusar com o código de idade mínima quando a pessoa só faz 16 anos amanhã', () => {
    const value = makeDataNascimento(16, 1);
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.DATA_NASCIMENTO.IDADE_MINIMA.message,
      { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.IDADE_MINIMA.domainCode },
    );

    const error = catchError(() => new DataNascimento(value));

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });

  it('Deve recusar com o código de data futura quando a data é amanhã', () => {
    const value = makeDataNascimento(0, 1);
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.DATA_NASCIMENTO.VALOR_FUTURO.message,
      { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.VALOR_FUTURO.domainCode },
    );

    const error = catchError(() => new DataNascimento(value));

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });

  it('Deve recusar com o código de data inválida quando o dia não existe no mês', () => {
    const value = '2001-02-30';
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.message,
      { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.domainCode },
    );

    const error = catchError(() => new DataNascimento(value));

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });

  it('Deve recusar com o código de data inválida quando a data não está no formato AAAA-MM-DD', () => {
    const value = '10/05/2000';
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.message,
      { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.INVALID.domainCode },
    );

    const error = catchError(() => new DataNascimento(value));

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });
});
