import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { GetPerfilUsecase } from './get-perfil.usecase';

describe('GetPerfilUsecase', () => {
  let usuarioRepository: InMemoryUsuarioRepository;
  let usecase: GetPerfilUsecase;

  beforeEach(() => {
    usuarioRepository = new InMemoryUsuarioRepository();
    usecase = new GetPerfilUsecase(usuarioRepository);
  });

  it('Deve devolver o perfil sem a senha e sem o CPF quando o usuário existe', async () => {
    const usuario = makeUsuarioRow();
    usuarioRepository.usuarios.set(usuario.id, usuario);
    const expectedPerfil = {
      id: '1',
      nome: 'Maria',
      sobrenome: 'Teste',
      nomeUsuario: 'maria.teste',
      email: 'maria@exemplo.com',
      imagemPerfilUrl: null,
      endereco: null,
    };

    const perfil = await usecase.execute('1');

    expect(perfil).toStrictEqual(expectedPerfil);
  });

  it('Deve recusar com sessão inválida quando o usuário do token foi excluído', async () => {
    const usuarioExcluido = makeUsuarioRow({ deletedAt: new Date() });
    usuarioRepository.usuarios.set(usuarioExcluido.id, usuarioExcluido);
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.AUTH.SESSAO_INVALIDA.message,
      { cause: DOMAIN_EXCEPTION.AUTH.SESSAO_INVALIDA.domainCode },
    );

    const error = await usecase.execute('1').catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });
});
