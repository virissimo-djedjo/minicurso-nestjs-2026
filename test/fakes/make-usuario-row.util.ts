import { UsuarioRow } from './fakes.dto';

export function makeUsuarioRow(dados: Partial<UsuarioRow> = {}): UsuarioRow {
  return {
    id: '1',
    nome: 'Maria',
    sobrenome: 'Teste',
    nomeUsuario: 'maria.teste',
    email: 'maria@exemplo.com',
    senhaHash: 'hash:segredo123',
    cpf: '52998224725',
    dataNascimento: '2000-05-10',
    status: 'ATIVO',
    enderecoId: null,
    imagemPerfilUrl: null,
    deletedAt: null,
    ...dados,
  };
}
