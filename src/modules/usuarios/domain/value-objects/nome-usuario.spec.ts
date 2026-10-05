import { catchError } from '../../../../../test/utils/catch-error.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { NomeUsuario } from './nome-usuario';

const EXPECTED_INVALID_ERROR = new DomainException(
  DOMAIN_EXCEPTION.NOME_USUARIO.INVALID.message,
  { cause: DOMAIN_EXCEPTION.NOME_USUARIO.INVALID.domainCode },
);

describe.skip('NomeUsuario', () => {
  it('Deve guardar o nome de usuário em minúsculas quando ele é válido', () => {
    const value = ' Maria_Teste.01 ';

    const nomeUsuario = new NomeUsuario(value);

    expect(nomeUsuario.getNomeUsuario()).toBe('maria_teste.01');
  });

  it('Deve recusar com o código de nome de usuário inválido quando tem menos de 3 caracteres', () => {
    const value = 'ma';

    const error = catchError(() => new NomeUsuario(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });

  it('Deve recusar com o código de nome de usuário inválido quando tem mais de 35 caracteres', () => {
    const value = 'm'.repeat(36);

    const error = catchError(() => new NomeUsuario(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });

  it('Deve recusar com o código de nome de usuário inválido quando tem hífen', () => {
    const value = 'maria-teste';

    const error = catchError(() => new NomeUsuario(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });

  it('Deve recusar com o código de nome de usuário inválido quando tem espaço no meio', () => {
    const value = 'maria teste';

    const error = catchError(() => new NomeUsuario(value));

    expect(error).toStrictEqual(EXPECTED_INVALID_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_INVALID_ERROR.cause);
  });
});
