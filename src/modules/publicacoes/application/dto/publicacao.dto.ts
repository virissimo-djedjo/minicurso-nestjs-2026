export const MAX_CONTEUDO_LENGTH = 1000;

export interface AutorDto {
  id: string;
  nomeUsuario: string;
  imagemPerfilUrl: string | null;
}

export interface PublicacaoDto {
  id: string;
  conteudo: string | null;
  imagemUrl: string | null;
  createdAt: Date;
  autor: AutorDto;
}

export interface CreatePublicacaoDto {
  usuarioId: string;
  conteudo: string | null;
  imagemUrl: string | null;
}

export interface PublicacaoCheckDto {
  hasPublicacao: boolean;
}

export interface PublicacaoAutorDto {
  autorId: string;
}
