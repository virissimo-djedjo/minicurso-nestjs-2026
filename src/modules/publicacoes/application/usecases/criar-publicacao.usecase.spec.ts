import sharp from 'sharp';
import { FakeStorageAdapter } from '../../../../../test/fakes/fake-storage.adapter';
import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import {
  FAKE_CREATED_AT,
  InMemoryPublicacaoRepository,
} from '../../../../../test/fakes/in-memory-publicacao.repository';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import { makePublicacaoRow } from '../../../../../test/fakes/make-publicacao-row.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { CriarPublicacaoUsecase } from './criar-publicacao.usecase';

const NOW = 1759550000000;

function makePngImagem(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background: '#e0234e' },
  })
    .png()
    .toBuffer();
}

describe('CriarPublicacaoUsecase', () => {
  let publicacaoRepository: InMemoryPublicacaoRepository;
  let storageAdapter: FakeStorageAdapter;
  let usecase: CriarPublicacaoUsecase;

  beforeEach(() => {
    const usuarioRepository = new InMemoryUsuarioRepository();
    usuarioRepository.usuarios.set('1', makeUsuarioRow());
    publicacaoRepository = new InMemoryPublicacaoRepository(usuarioRepository);
    storageAdapter = new FakeStorageAdapter();
    usecase = new CriarPublicacaoUsecase(publicacaoRepository, storageAdapter);
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Deve gravar a publicação só com texto e sem enviar arquivo quando não vem imagem', async () => {
    const expectedPublicacao = {
      id: '1',
      conteudo: 'Primeira sessão da campanha hoje!',
      imagemUrl: null,
      createdAt: FAKE_CREATED_AT,
      autor: { id: '1', nomeUsuario: 'maria.teste', imagemPerfilUrl: null },
    };
    const uploadSpy = jest.spyOn(storageAdapter, 'upload');

    const publicacao = await usecase.execute('1', {
      conteudo: '  Primeira sessão da campanha hoje!  ',
      imagem: null,
    });

    expect(publicacao).toStrictEqual(expectedPublicacao);
    expect([...publicacaoRepository.publicacoes.values()]).toStrictEqual([
      makePublicacaoRow(),
    ]);
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('Deve gravar a imagem em webp com no máximo 1080 de lado quando vem só a imagem', async () => {
    const imagem = await makePngImagem(2160, 1440);
    const expectedKey = `publicacoes/1/${NOW}.webp`;
    const expectedPublicacaoRow = makePublicacaoRow({
      conteudo: null,
      imagemUrl: `/uploads/${expectedKey}`,
    });
    const expectedMetadata = { format: 'webp', width: 1080, height: 720 };
    const uploadSpy = jest.spyOn(storageAdapter, 'upload');

    await usecase.execute('1', { conteudo: '', imagem });

    const storedFile = storageAdapter.files.get(expectedKey);
    const { format, width, height } = await sharp(storedFile?.imagem).metadata();
    expect([...publicacaoRepository.publicacoes.values()]).toStrictEqual([
      expectedPublicacaoRow,
    ]);
    expect(storedFile?.contentType).toBe('image/webp');
    expect({ format, width, height }).toStrictEqual(expectedMetadata);
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });

  it('Deve manter o tamanho original quando a imagem é menor que 1080', async () => {
    const imagem = await makePngImagem(400, 300);
    const expectedMetadata = { width: 400, height: 300 };

    await usecase.execute('1', { conteudo: null, imagem });

    const storedFile = storageAdapter.files.get(`publicacoes/1/${NOW}.webp`);
    const { width, height } = await sharp(storedFile?.imagem).metadata();
    expect({ width, height }).toStrictEqual(expectedMetadata);
  });

  it('Deve recusar e não gravar nada quando não vem texto nem imagem', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.PUBLICACAO.VAZIA.message,
      { cause: DOMAIN_EXCEPTION.PUBLICACAO.VAZIA.domainCode },
    );

    const error = await usecase
      .execute('1', { conteudo: '   ', imagem: null })
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(publicacaoRepository.publicacoes.size).toBe(0);
  });

  it('Deve recusar e não gravar nada quando o texto passa de 1000 caracteres', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.PUBLICACAO.CONTEUDO_LONGO.message,
      { cause: DOMAIN_EXCEPTION.PUBLICACAO.CONTEUDO_LONGO.domainCode },
    );

    const error = await usecase
      .execute('1', { conteudo: 'a'.repeat(1001), imagem: null })
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(publicacaoRepository.publicacoes.size).toBe(0);
  });

  it('Deve recusar e não gravar nada quando o arquivo não é uma imagem', async () => {
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.IMAGEM.TIPO_INVALIDO.message,
      { cause: DOMAIN_EXCEPTION.IMAGEM.TIPO_INVALIDO.domainCode },
    );
    const uploadSpy = jest.spyOn(storageAdapter, 'upload');

    const error = await usecase
      .execute('1', { conteudo: 'Olha isso', imagem: Buffer.from('texto') })
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(publicacaoRepository.publicacoes.size).toBe(0);
    expect(uploadSpy).not.toHaveBeenCalled();
  });
});
