import { IsString, MaxLength } from 'class-validator';
import { AutorDto, MAX_CONTEUDO_LENGTH } from './publicacao.dto';

export class ComentarPublicacaoDto {
  @IsString()
  @MaxLength(MAX_CONTEUDO_LENGTH)
  conteudo: string;
}

export interface ComentarioDto {
  id: string;
  publicacaoId: string;
  conteudo: string;
  createdAt: Date;
  autor: AutorDto;
}

export interface CreateComentarioDto {
  publicacaoId: number;
  usuarioId: string;
  conteudo: string;
}
