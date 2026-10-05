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
import { GetComentariosByPublicacaoUsecase } from './get-comentarios-by-publicacao.usecase';

describe('GetComentariosByPublicacaoUsecase', () => {
  let publicacaoRepository: InMemoryPublicacaoRepository;
  let comentarioRepository: InMemoryComentarioRepository;
  let usecase: GetComentariosByPublicacaoUsecase;

  beforeEach(() => {
    const usuarioRepository = new InMemoryUsuarioRepository();
    usuarioRepository.usuarios.set('1', makeUsuarioRow());
    publicacaoRepository = new InMemoryPublicacaoRepository(usuarioRepository);
    publicacaoRepository.publicacoes.set('1', makePublicacaoRow());
    publicacaoRepository.publicacoes.set('2', makePublicacaoRow({ id: '2' }));
    comentarioRepository = new InMemoryComentarioRepository(
      publicacaoRepository,
    );
    usecase = new GetComentariosByPublicacaoUsecase(
      publicacaoRepository,
      comentarioRepository,
    );
  });

  it('Deve listar só os comentários da publicação quando ela existe', async () => {
    await comentarioRepository.save({
      publicacaoId: 1,
      usuarioId: '1',
      conteudo: 'Bora jogar!',
    });
    await comentarioRepository.save({
      publicacaoId: 2,
      usuarioId: '1',
      conteudo: 'Outra publicação',
    });
    const expectedComentarios = [
      {
        id: '1',
        publicacaoId: '1',
        conteudo: 'Bora jogar!',
        createdAt: FAKE_CREATED_AT,
        autor: { id: '1', nomeUsuario: 'maria.teste', imagemPerfilUrl: null },
      },
    ];

    const comentarios = await usecase.execute(1);

    expect(comentarios).toStrictEqual(expectedComentarios);
  });

  it('Deve informar publicação não encontrada quando a publicação não existe', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
      { cause: DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.domainCode },
    );

    const error = await usecase.execute(99).catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
  });
});
