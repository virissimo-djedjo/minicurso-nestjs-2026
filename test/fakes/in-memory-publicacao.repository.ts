import {
  AutorDto,
  CreatePublicacaoDto,
  PublicacaoDto,
} from '../../src/modules/publicacoes/application/dto/publicacao.dto';
import { PublicacaoRepository } from '../../src/modules/publicacoes/application/repositories/publicacao.repository';
import { PublicacaoRow } from './fakes.dto';
import { InMemoryUsuarioRepository } from './in-memory-usuario.repository';

export const FAKE_CREATED_AT = new Date('2026-10-05T10:00:00.000Z');

export class InMemoryPublicacaoRepository implements PublicacaoRepository {
  readonly publicacoes = new Map<string, PublicacaoRow>();

  constructor(private readonly usuarioRepository: InMemoryUsuarioRepository) {}

  public async save(publicacao: CreatePublicacaoDto): Promise<PublicacaoDto> {
    const row: PublicacaoRow = {
      id: String(this.publicacoes.size + 1),
      ...publicacao,
      status: 'PUBLICADA',
      createdAt: FAKE_CREATED_AT,
      deletedAt: null,
    };
    this.publicacoes.set(row.id, row);
    return this.toPublicacaoDto(row);
  }

  public async getFeed(page: number, limit: number): Promise<PublicacaoDto[]> {
    return this.getActivePublicacoes()
      .reverse()
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toPublicacaoDto(row));
  }

  public async hasPublicacao(publicacaoId: number): Promise<boolean> {
    return !!this.getActivePublicacao(publicacaoId);
  }

  public async getAutorIdById(publicacaoId: number): Promise<string | null> {
    return this.getActivePublicacao(publicacaoId)?.usuarioId ?? null;
  }

  public async deletePublicacaoById(publicacaoId: number): Promise<boolean> {
    const row = this.getActivePublicacao(publicacaoId);
    if (!row) {
      return false;
    }
    row.deletedAt = FAKE_CREATED_AT;
    return true;
  }

  public getAutor(usuarioId: string): AutorDto {
    const usuario = this.usuarioRepository.usuarios.get(usuarioId);
    return {
      id: usuarioId,
      nomeUsuario: usuario?.nomeUsuario ?? '',
      imagemPerfilUrl: usuario?.imagemPerfilUrl ?? null,
    };
  }

  private getActivePublicacao(publicacaoId: number): PublicacaoRow | undefined {
    return this.getActivePublicacoes().find(
      (publicacao) => publicacao.id === String(publicacaoId),
    );
  }

  private getActivePublicacoes(): PublicacaoRow[] {
    return [...this.publicacoes.values()].filter(
      (publicacao) => !publicacao.deletedAt,
    );
  }

  private toPublicacaoDto(row: PublicacaoRow): PublicacaoDto {
    return {
      id: row.id,
      conteudo: row.conteudo,
      imagemUrl: row.imagemUrl,
      createdAt: row.createdAt,
      autor: this.getAutor(row.usuarioId),
    };
  }
}
