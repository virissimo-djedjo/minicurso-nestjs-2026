import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import {
  FAKE_CREATED_AT,
  InMemoryPublicacaoRepository,
} from '../../../../../test/fakes/in-memory-publicacao.repository';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import { makePublicacaoRow } from '../../../../../test/fakes/make-publicacao-row.util';
import { GetFeedUsecase } from './get-feed.usecase';

const AUTOR = { id: '1', nomeUsuario: 'maria.teste', imagemPerfilUrl: null };

describe('GetFeedUsecase', () => {
  let usecase: GetFeedUsecase;

  beforeEach(() => {
    const usuarioRepository = new InMemoryUsuarioRepository();
    usuarioRepository.usuarios.set('1', makeUsuarioRow());
    const publicacaoRepository = new InMemoryPublicacaoRepository(
      usuarioRepository,
    );
    const publicacoes = [
      makePublicacaoRow({ id: '1', conteudo: 'Primeira' }),
      makePublicacaoRow({
        id: '2',
        conteudo: 'Excluída',
        deletedAt: FAKE_CREATED_AT,
      }),
      makePublicacaoRow({ id: '3', conteudo: 'Segunda' }),
      makePublicacaoRow({ id: '4', conteudo: 'Terceira' }),
    ];
    publicacoes.forEach((publicacao) =>
      publicacaoRepository.publicacoes.set(publicacao.id, publicacao),
    );
    usecase = new GetFeedUsecase(publicacaoRepository);
  });

  it('Deve listar da mais nova para a mais antiga sem as excluídas quando pede a primeira página', async () => {
    const expectedFeed = [
      { id: '4', conteudo: 'Terceira', imagemUrl: null, createdAt: FAKE_CREATED_AT, autor: AUTOR },
      { id: '3', conteudo: 'Segunda', imagemUrl: null, createdAt: FAKE_CREATED_AT, autor: AUTOR },
    ];

    const feed = await usecase.execute(1, 2);

    expect(feed).toStrictEqual(expectedFeed);
  });

  it('Deve devolver o que sobrou quando pede a última página', async () => {
    const expectedFeed = [
      { id: '1', conteudo: 'Primeira', imagemUrl: null, createdAt: FAKE_CREATED_AT, autor: AUTOR },
    ];

    const feed = await usecase.execute(2, 2);

    expect(feed).toStrictEqual(expectedFeed);
  });
});
