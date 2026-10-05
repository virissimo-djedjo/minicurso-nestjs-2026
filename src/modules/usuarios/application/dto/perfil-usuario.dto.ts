export interface EnderecoPerfilDto {
  cep: string;
  logradouro: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

export interface PerfilUsuarioDto {
  id: string;
  nome: string;
  sobrenome: string;
  nomeUsuario: string;
  email: string;
  imagemPerfilUrl: string | null;
  endereco: EnderecoPerfilDto | null;
}
