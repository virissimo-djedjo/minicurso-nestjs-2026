import { Injectable } from '@nestjs/common';
import { PublicacaoDto } from '../dto/publicacao.dto';
import { PublicacaoRepository } from '../repositories/publicacao.repository';

@Injectable()
export class GetFeedUsecase {
  constructor(private readonly publicacaoRepository: PublicacaoRepository) {}

  public async execute(page: number, limit: number): Promise<PublicacaoDto[]> {
    return this.publicacaoRepository.getFeed(page, limit);
  }
}
