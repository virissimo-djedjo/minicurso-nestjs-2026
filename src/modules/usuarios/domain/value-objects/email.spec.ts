import { catchError } from '../../../../../test/utils/catch-error.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { Email } from './email';

const EXPECTED_INVALID_ERROR = new DomainException(
  DOMAIN_EXCEPTION.EMAIL.INVALID.message,
  { cause: DOMAIN_EXCEPTION.EMAIL.INVALID.domainCode },
);

describe('Email', () => {
  it('Deve guardar o e-mail em minúsculas e sem espaços nas pontas quando o e-mail é válido', () => {
    const value = '  Maria.Teste@Exemplo.com ';

    const email = new Email(value);

    expect(email.getEmail()).toBe('maria.teste@exemplo.com');
  });

  it('Deve recusar com o código de e-mail inválido quando falta o arroba', () => {
    const value = 'maria.exemplo.com';

    const error = catchError(() => new Email(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });

  it('Deve recusar com o código de e-mail inválido quando falta o domínio', () => {
    const value = 'maria@';

    const error = catchError(() => new Email(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });

  it('Deve recusar com o código de e-mail inválido quando tem espaço no meio', () => {
    const value = 'maria teste@exemplo.com';

    const error = catchError(() => new Email(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });
});
