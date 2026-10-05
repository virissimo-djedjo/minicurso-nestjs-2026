import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export const MAX_CONTEUDO_LENGTH = 1000;

const MAX_FEED_LIMIT = 50;

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

export interface CriarPublicacaoDto {
  conteudo: string | null;
  imagem: Buffer | null;
}

export class GetFeedQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_FEED_LIMIT)
  limit: number = 20;
}
