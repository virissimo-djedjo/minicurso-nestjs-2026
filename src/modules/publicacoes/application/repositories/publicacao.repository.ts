import { CreatePublicacaoDto, PublicacaoDto } from '../dto/publicacao.dto';

export abstract class PublicacaoRepository {
  abstract save(publicacao: CreatePublicacaoDto): Promise<PublicacaoDto>;

  abstract getFeed(page: number, limit: number): Promise<PublicacaoDto[]>;

  abstract hasPublicacao(publicacaoId: number): Promise<boolean>;

  abstract getAutorIdById(publicacaoId: number): Promise<string | null>;

  abstract deletePublicacaoById(publicacaoId: number): Promise<boolean>;
}
