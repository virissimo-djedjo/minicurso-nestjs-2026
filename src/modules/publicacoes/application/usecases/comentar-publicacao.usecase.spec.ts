import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import {
  FAKE_CREATED_AT,
  InMemoryPublicacaoRepository,
} from '../../../../../test/fakes/in-memory-publicacao.repository';
import { InMemoryComentarioRepository } from '../../../../../test/fakes/in-memory-comentario.repository';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import { makePublicacaoRow } from '../../../../../test/fakes/make-publicacao-row.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { ComentarPublicacaoUsecase } from './comentar-publicacao.usecase';

describe('ComentarPublicacaoUsecase', () => {
  let publicacaoRepository: InMemoryPublicacaoRepository;
  let comentarioRepository: InMemoryComentarioRepository;
  let usecase: ComentarPublicacaoUsecase;

  beforeEach(() => {
    const usuarioRepository = new InMemoryUsuarioRepository();
    usuarioRepository.usuarios.set('1', makeUsuarioRow());
    usuarioRepository.usuarios.set(
      '2',
      makeUsuarioRow({ id: '2', nomeUsuario: 'joao.teste' }),
    );
    publicacaoRepository = new InMemoryPublicacaoRepository(usuarioRepository);
    publicacaoRepository.publicacoes.set('1', makePublicacaoRow());
    comentarioRepository = new InMemoryComentarioRepository(
      publicacaoRepository,
    );
    usecase = new ComentarPublicacaoUsecase(comentarioRepository);
  });

  it('Deve gravar o comentário com o autor logado quando a publicação existe', async () => {
    const expectedComentario = {
      id: '1',
      publicacaoId: '1',
      conteudo: 'Bora jogar!',
      createdAt: FAKE_CREATED_AT,
      autor: { id: '2', nomeUsuario: 'joao.teste', imagemPerfilUrl: null },
    };
    const expectedComentarioRow = {
      id: '1',
      publicacaoId: '1',
      usuarioId: '2',
      conteudo: 'Bora jogar!',
      createdAt: FAKE_CREATED_AT,
      deletedAt: null,
    };

    const comentario = await usecase.execute(1, '2', {
      conteudo: '  Bora jogar!  ',
    });

    expect(comentario).toStrictEqual(expectedComentario);
    expect([...comentarioRepository.comentarios.values()]).toStrictEqual([
      expectedComentarioRow,
    ]);
  });

  it('Deve recusar e não gravar nada quando o comentário só tem espaços', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.COMENTARIO.VAZIO.message,
      { cause: DOMAIN_EXCEPTION.COMENTARIO.VAZIO.domainCode },
    );

    const error = await usecase
      .execute(1, '2', { conteudo: '   ' })
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(comentarioRepository.comentarios.size).toBe(0);
  });

  it('Deve informar publicação não encontrada e não gravar nada quando a publicação foi excluída', async () => {
    publicacaoRepository.publicacoes.set(
      '1',
      makePublicacaoRow({ deletedAt: FAKE_CREATED_AT }),
    );
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
      { cause: DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.domainCode },
    );

    const error = await usecase
      .execute(1, '2', { conteudo: 'Bora jogar!' })
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(comentarioRepository.comentarios.size).toBe(0);
  });
});
