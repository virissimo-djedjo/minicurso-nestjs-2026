import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import {
  FAKE_CREATED_AT,
  InMemoryPublicacaoRepository,
} from '../../../../../test/fakes/in-memory-publicacao.repository';
import { makePublicacaoRow } from '../../../../../test/fakes/make-publicacao-row.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { ExcluirPublicacaoUsecase } from './excluir-publicacao.usecase';

describe('ExcluirPublicacaoUsecase', () => {
  let publicacaoRepository: InMemoryPublicacaoRepository;
  let usecase: ExcluirPublicacaoUsecase;

  beforeEach(() => {
    publicacaoRepository = new InMemoryPublicacaoRepository(
      new InMemoryUsuarioRepository(),
    );
    usecase = new ExcluirPublicacaoUsecase(publicacaoRepository);
  });

  it('Deve marcar a publicação como excluída quando ela existe', async () => {
    publicacaoRepository.publicacoes.set('1', makePublicacaoRow());
    const expectedPublicacao = makePublicacaoRow({ deletedAt: FAKE_CREATED_AT });

    await usecase.execute(1);

    expect(publicacaoRepository.publicacoes.get('1')).toStrictEqual(
      expectedPublicacao,
    );
  });

  it('Deve informar publicação não encontrada quando ela já foi excluída', async () => {
    const excludedPublicacao = makePublicacaoRow({
      deletedAt: new Date('2026-10-01T10:00:00.000Z'),
    });
    publicacaoRepository.publicacoes.set('1', excludedPublicacao);
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
      { cause: DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.domainCode },
    );

    const error = await usecase.execute(1).catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(publicacaoRepository.publicacoes.get('1')).toStrictEqual(
      excludedPublicacao,
    );
  });
});
