import sharp from 'sharp';
import { FakeStorageAdapter } from '../../../../../test/fakes/fake-storage.adapter';
import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { AtualizarImagemPerfilUsecase } from './atualizar-imagem-perfil.usecase';

const NOW = 1759550000000;

function makePngImagem(): Promise<Buffer> {
  return sharp({
    create: { width: 800, height: 600, channels: 3, background: '#e0234e' },
  })
    .png()
    .toBuffer();
}

describe('AtualizarImagemPerfilUsecase', () => {
  let usuarioRepository: InMemoryUsuarioRepository;
  let storageAdapter: FakeStorageAdapter;
  let usecase: AtualizarImagemPerfilUsecase;

  beforeEach(() => {
    usuarioRepository = new InMemoryUsuarioRepository();
    storageAdapter = new FakeStorageAdapter();
    usecase = new AtualizarImagemPerfilUsecase(
      usuarioRepository,
      storageAdapter,
    );
    const usuario = makeUsuarioRow();
    usuarioRepository.usuarios.set(usuario.id, usuario);
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Deve gravar a imagem em webp de 512x512 e atualizar o perfil quando o arquivo é uma imagem válida', async () => {
    const imagem = await makePngImagem();
    const expectedKey = `usuarios/1/perfil-${NOW}.webp`;
    const expectedUsuario = makeUsuarioRow({
      imagemPerfilUrl: `/uploads/${expectedKey}`,
    });
    const expectedMetadata = { format: 'webp', width: 512, height: 512 };
    const uploadSpy = jest.spyOn(storageAdapter, 'upload');

    const imagemPerfil = await usecase.execute('1', imagem);

    const storedFile = storageAdapter.files.get(expectedKey);
    const { format, width, height } = await sharp(storedFile?.imagem).metadata();
    expect(imagemPerfil).toStrictEqual({
      imagemPerfilUrl: `/uploads/${expectedKey}`,
    });
    expect(usuarioRepository.usuarios.get('1')).toStrictEqual(expectedUsuario);
    expect(storedFile?.contentType).toBe('image/webp');
    expect({ format, width, height }).toStrictEqual(expectedMetadata);
    expect(uploadSpy).toHaveBeenCalledWith(
      expectedKey,
      expect.any(Buffer),
      'image/webp',
    );
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });

  it('Deve recusar e não gravar nada quando os bytes do arquivo não são de uma imagem', async () => {
    const pdfRenomeado = Buffer.from('%PDF-1.4 arquivo que não é imagem');
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.IMAGEM.TIPO_INVALIDO.message,
      { cause: DOMAIN_EXCEPTION.IMAGEM.TIPO_INVALIDO.domainCode },
    );
    const uploadSpy = jest.spyOn(storageAdapter, 'upload');

    const error = await usecase
      .execute('1', pdfRenomeado)
      .catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(usuarioRepository.usuarios.get('1')).toStrictEqual(makeUsuarioRow());
    expect(storageAdapter.files.size).toBe(0);
    expect(uploadSpy).not.toHaveBeenCalled();
  });
});
