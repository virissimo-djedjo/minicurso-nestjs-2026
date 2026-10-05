import { JwtService } from '@nestjs/jwt';
import { FakeHashAdapter } from '../../../../../test/fakes/fake-hash.adapter';
import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { AutenticarUsuarioUsecase } from './autenticar-usuario.usecase';

const EXPECTED_CREDENCIAIS_ERROR = new DomainException(
  DOMAIN_EXCEPTION.AUTH.CREDENCIAIS_INVALIDAS.message,
  { cause: DOMAIN_EXCEPTION.AUTH.CREDENCIAIS_INVALIDAS.domainCode },
);

describe('AutenticarUsuarioUsecase', () => {
  let usuarioRepository: InMemoryUsuarioRepository;
  let hashAdapter: FakeHashAdapter;
  let jwtService: JwtService;
  let usecase: AutenticarUsuarioUsecase;

  beforeEach(() => {
    usuarioRepository = new InMemoryUsuarioRepository();
    hashAdapter = new FakeHashAdapter();
    jwtService = new JwtService({ secret: 'segredo-de-teste' });
    usecase = new AutenticarUsuarioUsecase(
      usuarioRepository,
      hashAdapter,
      jwtService,
    );
    const usuario = makeUsuarioRow();
    usuarioRepository.usuarios.set(usuario.id, usuario);
  });

  it('Deve devolver um token com o id do usuário quando e-mail e senha estão certos', async () => {
    const credenciais = { email: 'Maria@Exemplo.com', senha: 'segredo123' };
    const expectedPayload = { sub: '1', nomeUsuario: 'maria.teste' };
    const compareSpy = jest.spyOn(hashAdapter, 'compare');

    const { accessToken } = await usecase.execute(credenciais);

    expect(jwtService.verify(accessToken)).toStrictEqual({
      ...expectedPayload,
      iat: expect.any(Number),
    });
    expect(compareSpy).toHaveBeenCalledWith('segredo123', 'hash:segredo123');
    expect(compareSpy).toHaveBeenCalledTimes(1);
  });

  it('Deve recusar o login com a mensagem genérica quando a senha está errada', async () => {
    const credenciais = { email: 'maria@exemplo.com', senha: 'senha-errada' };

    const error = await usecase
      .execute(credenciais)
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(EXPECTED_CREDENCIAIS_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_CREDENCIAIS_ERROR.cause);
  });

  it('Deve recusar o login com a mesma mensagem e conferir a senha mesmo assim quando o e-mail não existe', async () => {
    const credenciais = { email: 'ninguem@exemplo.com', senha: 'segredo123' };
    const compareSpy = jest.spyOn(hashAdapter, 'compare');

    const error = await usecase
      .execute(credenciais)
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(EXPECTED_CREDENCIAIS_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_CREDENCIAIS_ERROR.cause);
    expect(compareSpy).toHaveBeenCalledTimes(1);
  });

  it('Deve recusar o login com a mesma mensagem quando o usuário foi excluído', async () => {
    const usuarioExcluido = makeUsuarioRow({ deletedAt: new Date() });
    usuarioRepository.usuarios.set(usuarioExcluido.id, usuarioExcluido);
    const credenciais = { email: 'maria@exemplo.com', senha: 'segredo123' };

    const error = await usecase
      .execute(credenciais)
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(EXPECTED_CREDENCIAIS_ERROR);
    expect(error).toHaveProperty('cause', EXPECTED_CREDENCIAIS_ERROR.cause);
  });

  it('Deve recusar o login quando a conta não está ativa', async () => {
    const usuarioBanido = makeUsuarioRow({ status: 'BANIDO' });
    usuarioRepository.usuarios.set(usuarioBanido.id, usuarioBanido);
    const credenciais = { email: 'maria@exemplo.com', senha: 'segredo123' };
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.AUTH.USUARIO_INATIVO.message,
      { cause: DOMAIN_EXCEPTION.AUTH.USUARIO_INATIVO.domainCode },
    );

    const error = await usecase
      .execute(credenciais)
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });
});
