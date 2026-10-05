import { ComentarioDto, CreateComentarioDto } from '../dto/comentario.dto';

export abstract class ComentarioRepository {
  abstract save(comentario: CreateComentarioDto): Promise<ComentarioDto | null>;

  abstract getComentariosByPublicacaoId(
    publicacaoId: number,
  ): Promise<ComentarioDto[]>;
}
