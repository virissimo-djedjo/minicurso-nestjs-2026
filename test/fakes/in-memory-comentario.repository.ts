import {
  ComentarioDto,
  CreateComentarioDto,
} from '../../src/modules/publicacoes/application/dto/comentario.dto';
import { ComentarioRepository } from '../../src/modules/publicacoes/application/repositories/comentario.repository';
import { ComentarioRow } from './fakes.dto';
import {
  FAKE_CREATED_AT,
  InMemoryPublicacaoRepository,
} from './in-memory-publicacao.repository';

export class InMemoryComentarioRepository implements ComentarioRepository {
  readonly comentarios = new Map<string, ComentarioRow>();

  constructor(
    private readonly publicacaoRepository: InMemoryPublicacaoRepository,
  ) {}

  public async save(
    comentario: CreateComentarioDto,
  ): Promise<ComentarioDto | null> {
    if (!(await this.publicacaoRepository.hasPublicacao(comentario.publicacaoId))) {
      return null;
    }
    const row: ComentarioRow = {
      id: String(this.comentarios.size + 1),
      publicacaoId: String(comentario.publicacaoId),
      usuarioId: comentario.usuarioId,
      conteudo: comentario.conteudo,
      createdAt: FAKE_CREATED_AT,
      deletedAt: null,
    };
    this.comentarios.set(row.id, row);
    return this.toComentarioDto(row);
  }

  public async getComentariosByPublicacaoId(
    publicacaoId: number,
  ): Promise<ComentarioDto[]> {
    return [...this.comentarios.values()]
      .filter(
        (comentario) =>
          comentario.publicacaoId === String(publicacaoId) &&
          !comentario.deletedAt,
      )
      .map((row) => this.toComentarioDto(row));
  }

  private toComentarioDto(row: ComentarioRow): ComentarioDto {
    return {
      id: row.id,
      publicacaoId: row.publicacaoId,
      conteudo: row.conteudo,
      createdAt: row.createdAt,
      autor: this.publicacaoRepository.getAutor(row.usuarioId),
    };
  }
}
