import { FakeHashAdapter } from '../../../../../test/fakes/fake-hash.adapter';
import { makeUsuarioRow } from '../../../../../test/fakes/make-usuario-row.util';
import { InMemoryUsuarioRepository } from '../../../../../test/fakes/in-memory-usuario.repository';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { CadastrarUsuarioDto } from '../dto/cadastrar-usuario.dto';
import { CadastrarUsuarioUsecase } from './cadastrar-usuario.usecase';
import { InMemoryEnderecoRepository } from '../../../../../test/fakes/in-memory-endereco.repository';
import { FakeCepProviderAdapter } from '../../../../../test/fakes/fake-cep-provider.adapter';
import { makeEndereco } from '../../../../../test/fakes/make-endereco.util';
import { MapCacheAdapter } from '../../../common/infra/cache/map-cache.adapter';
import { GetEnderecoByCepUsecase } from '../../../enderecos/application/usecases/get-endereco-by-cep.usecase';

function makeCadastrarUsuarioDto(
  dados: Partial<CadastrarUsuarioDto> = {},
): CadastrarUsuarioDto {
  return {
    nome: 'Maria',
    sobrenome: 'Teste',
    nomeUsuario: 'maria.teste',
    email: 'maria@exemplo.com',
    senha: 'segredo123',
    cpf: '529.982.247-25',
    dataNascimento: '2000-05-10',
    ...dados,
  };
}

describe('CadastrarUsuarioUsecase', () => {
  let usuarioRepository: InMemoryUsuarioRepository;
  let hashAdapter: FakeHashAdapter;
  let enderecoRepository: InMemoryEnderecoRepository;
  let cepProvider: FakeCepProviderAdapter;
  let usecase: CadastrarUsuarioUsecase;

  beforeEach(() => {
    usuarioRepository = new InMemoryUsuarioRepository();
    hashAdapter = new FakeHashAdapter();
    enderecoRepository = new InMemoryEnderecoRepository();
    cepProvider = new FakeCepProviderAdapter();
    usecase = new CadastrarUsuarioUsecase(
      usuarioRepository,
      hashAdapter,
      new GetEnderecoByCepUsecase(
        new MapCacheAdapter(),
        enderecoRepository,
        cepProvider,
      ),
    );
  });

  it('Deve cadastrar o usuário ativo com a senha guardada como hash quando os dados são válidos', async () => {
    const dados = makeCadastrarUsuarioDto({ email: 'Maria@Exemplo.com' });
    const expectedUsuario = makeUsuarioRow();
    const expectedUsuarioCadastrado = {
      id: '1',
      nome: 'Maria',
      sobrenome: 'Teste',
      nomeUsuario: 'maria.teste',
      email: 'maria@exemplo.com',
      dataNascimento: '2000-05-10',
      status: 'ATIVO',
    };
    const hashSpy = jest.spyOn(hashAdapter, 'hash');

    const usuarioCadastrado = await usecase.execute(dados);

    expect(usuarioRepository.usuarios.get('1')).toStrictEqual(expectedUsuario);
    expect(usuarioCadastrado).toStrictEqual(expectedUsuarioCadastrado);
    expect(hashSpy).toHaveBeenCalledWith('segredo123');
    expect(hashSpy).toHaveBeenCalledTimes(1);
  });

  it('Deve recusar o cadastro quando a pessoa tem menos de 16 anos', async () => {
    const dados = makeCadastrarUsuarioDto({
      dataNascimento: `${new Date().getFullYear() - 15}-01-01`,
    });
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.DATA_NASCIMENTO.IDADE_MINIMA.message,
      { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.IDADE_MINIMA.domainCode },
    );

    const error = await usecase.execute(dados).catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(usuarioRepository.usuarios.size).toBe(0);
  });

  it('Deve recusar o cadastro quando a data de nascimento está no futuro', async () => {
    const dados = makeCadastrarUsuarioDto({
      dataNascimento: `${new Date().getFullYear() + 1}-01-01`,
    });
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.DATA_NASCIMENTO.VALOR_FUTURO.message,
      { cause: DOMAIN_EXCEPTION.DATA_NASCIMENTO.VALOR_FUTURO.domainCode },
    );

    const error = await usecase.execute(dados).catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(usuarioRepository.usuarios.size).toBe(0);
  });

  it('Deve recusar o cadastro quando o CPF tem dígito verificador errado', async () => {
    const dados = makeCadastrarUsuarioDto({ cpf: '52998224724' });
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.CPF.FALHA_VALIDACAO.message,
      { cause: DOMAIN_EXCEPTION.CPF.FALHA_VALIDACAO.domainCode },
    );

    const error = await usecase.execute(dados).catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect(usuarioRepository.usuarios.size).toBe(0);
  });

  it('Deve recusar o cadastro quando o CPF já pertence a outro usuário', async () => {
    const usuarioExistente = makeUsuarioRow({
      nomeUsuario: 'outra.pessoa',
      email: 'outra@exemplo.com',
    });
    usuarioRepository.usuarios.set(usuarioExistente.id, usuarioExistente);
    const dados = makeCadastrarUsuarioDto();
    const expectedError = new DomainException(
      DOMAIN_EXCEPTION.USUARIO.JA_CADASTRADO.message,
      { cause: DOMAIN_EXCEPTION.USUARIO.JA_CADASTRADO.domainCode },
    );

    const error = await usecase.execute(dados).catch((error: unknown) => error);

    expect(error).toStrictEqual(expectedError);
    expect(error).toHaveProperty('cause', expectedError.cause);
    expect([...usuarioRepository.usuarios.values()]).toStrictEqual([
      usuarioExistente,
    ]);
  });

  it('Deve vincular o endereço do CEP quando o cadastro informa um CEP', async () => {
    cepProvider.enderecos.set('01001000', makeEndereco());
    const dados = makeCadastrarUsuarioDto({ cep: '01001-000' });
    const expectedUsuario = makeUsuarioRow({ enderecoId: '1' });
    const expectedEndereco = { id: '1', ...makeEndereco(), deletedAt: null };

    await usecase.execute(dados);

    expect(usuarioRepository.usuarios.get('1')).toStrictEqual(expectedUsuario);
    expect(enderecoRepository.enderecos.get('1')).toStrictEqual(
      expectedEndereco,
    );
  });
});
