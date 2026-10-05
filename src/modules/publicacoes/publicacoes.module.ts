import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { PublicacaoRepository } from './application/repositories/publicacao.repository';
import { PostgresPublicacaoRepository } from './infra/database/repository/postgres-publicacao.repository';
import { ComentarioRepository } from './application/repositories/comentario.repository';
import { PostgresComentarioRepository } from './infra/database/repository/postgres-comentario.repository';
import { ComentarPublicacaoUsecase } from './application/usecases/comentar-publicacao.usecase';
import { GetComentariosByPublicacaoUsecase } from './application/usecases/get-comentarios-by-publicacao.usecase';
import { ExcluirPublicacaoUsecase } from './application/usecases/excluir-publicacao.usecase';
import { GetFeedUsecase } from './application/usecases/get-feed.usecase';
import { PublicacoesController } from './infra/http/publicacoes.controller';

const SERVICES = [
  ComentarPublicacaoUsecase,
  GetComentariosByPublicacaoUsecase,
  ExcluirPublicacaoUsecase,
  GetFeedUsecase,
];

@Module({
  imports: [CommonModule],
  controllers: [PublicacoesController],
  providers: [
    { provide: PublicacaoRepository, useClass: PostgresPublicacaoRepository },
    { provide: ComentarioRepository, useClass: PostgresComentarioRepository },
    ...SERVICES,
  ],
  exports: [],
})
export class PublicacoesModule {}
