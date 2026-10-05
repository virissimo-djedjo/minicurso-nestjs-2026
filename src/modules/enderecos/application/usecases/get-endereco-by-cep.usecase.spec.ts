import { FakeCepProviderAdapter } from '../../../../../test/fakes/fake-cep-provider.adapter';
import { InMemoryEnderecoRepository } from '../../../../../test/fakes/in-memory-endereco.repository';
import { makeEndereco } from '../../../../../test/fakes/make-endereco.util';
import { MapCacheAdapter } from '../../../common/infra/cache/map-cache.adapter';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { GetEnderecoByCepUsecase } from './get-endereco-by-cep.usecase';

describe('GetEnderecoByCepUsecase', () => {
  let cacheAdapter: MapCacheAdapter;
  let enderecoRepository: InMemoryEnderecoRepository;
  let cepProvider: FakeCepProviderAdapter;
  let usecase: GetEnderecoByCepUsecase;

  beforeEach(() => {
    cacheAdapter = new MapCacheAdapter();
    enderecoRepository = new InMemoryEnderecoRepository();
    cepProvider = new FakeCepProviderAdapter();
    usecase = new GetEnderecoByCepUsecase(
      cacheAdapter,
      enderecoRepository,
      cepProvider,
    );
  });

  it('Deve responder do cache sem consultar banco nem ViaCEP quando o CEP está em cache', async () => {
    const cachedEndereco = { id: '7', ...makeEndereco() };
    await cacheAdapter.set('endereco:01001000', cachedEndereco);
    const repositorySpy = jest.spyOn(enderecoRepository, 'getEnderecoByCep');
    const cepProviderSpy = jest.spyOn(cepProvider, 'getEnderecoByCep');

    const endereco = await usecase.execute('01001-000');

    expect(endereco).toStrictEqual(cachedEndereco);
    expect(repositorySpy).not.toHaveBeenCalled();
    expect(cepProviderSpy).not.toHaveBeenCalled();
  });

  it('Deve responder do banco e preencher o cache quando o CEP não está em cache', async () => {
    const savedEndereco = await enderecoRepository.save(makeEndereco());
    const cacheSpy = jest.spyOn(cacheAdapter, 'set');
    const cepProviderSpy = jest.spyOn(cepProvider, 'getEnderecoByCep');

    const endereco = await usecase.execute('01001000');

    expect(endereco).toStrictEqual(savedEndereco);
    expect(await cacheAdapter.get('endereco:01001000')).toStrictEqual(
      savedEndereco,
    );
    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cepProviderSpy).not.toHaveBeenCalled();
  });

  it('Deve consultar o ViaCEP e gravar no banco e no cache quando o CEP é novo', async () => {
    cepProvider.enderecos.set('01001000', makeEndereco());
    const expectedEndereco = { id: '1', ...makeEndereco() };
    const cepProviderSpy = jest.spyOn(cepProvider, 'getEnderecoByCep');
    const cacheSpy = jest.spyOn(cacheAdapter, 'set');

    const endereco = await usecase.execute('01001-000');

    expect(endereco).toStrictEqual(expectedEndereco);
    expect(enderecoRepository.enderecos.get('1')).toStrictEqual({
      ...expectedEndereco,
      deletedAt: null,
    });
    expect(await cacheAdapter.get('endereco:01001000')).toStrictEqual(
      expectedEndereco,
    );
    expect(cepProviderSpy).toHaveBeenCalledWith('01001000');
    expect(cepProviderSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledTimes(1);
  });

  it('Deve recusar sem consultar o ViaCEP quando o CEP não tem 8 dígitos', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.CEP.INVALID.message,
      { cause: DOMAIN_EXCEPTION.CEP.INVALID.domainCode },
    );
    const cepProviderSpy = jest.spyOn(cepProvider, 'getEnderecoByCep');

    const error = await usecase.execute('1234').catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(cepProviderSpy).not.toHaveBeenCalled();
  });

  it('Deve informar CEP não encontrado e não gravar nada quando o ViaCEP não conhece o CEP', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.CEP.NAO_ENCONTRADO.message,
      { cause: DOMAIN_EXCEPTION.CEP.NAO_ENCONTRADO.domainCode },
    );
    const cacheSpy = jest.spyOn(cacheAdapter, 'set');

    const error = await usecase
      .execute('00000000')
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(enderecoRepository.enderecos.size).toBe(0);
    expect(cacheSpy).not.toHaveBeenCalled();
  });
});
