export const UsuarioStatus = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  BANIDO: 'BANIDO',
} as const;

export type UsuarioStatus = (typeof UsuarioStatus)[keyof typeof UsuarioStatus];

export interface CreateUsuarioDto {
  nome: string;
  sobrenome: string;
  nomeUsuario: string;
  email: string;
  senhaHash: string;
  cpf: string;
  dataNascimento: string;
  enderecoId: string | null;
}
