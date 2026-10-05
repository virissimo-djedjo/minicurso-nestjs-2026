import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getFileBuffer } from '../../../common/infra/http/multipart.util';
import {
  CriarPublicacaoDto,
  GetFeedQueryDto,
} from '../../application/dto/publicacao.dto';
import { CriarPublicacaoUsecase } from '../../application/usecases/criar-publicacao.usecase';
import { GetFeedUsecase } from '../../application/usecases/get-feed.usecase';
import { OwnershipGuard } from './ownership.guard';
import { CurrentUser } from '../../../common/infra/http/current-user.decorator';
import type { UsuarioAutenticadoDto } from '../../../common/application/dto/usuario-autenticado.dto';
import { ComentarPublicacaoDto } from '../../application/dto/comentario.dto';
import { ComentarPublicacaoUsecase } from '../../application/usecases/comentar-publicacao.usecase';
import { GetComentariosByPublicacaoUsecase } from '../../application/usecases/get-comentarios-by-publicacao.usecase';
import { ExcluirPublicacaoUsecase } from '../../application/usecases/excluir-publicacao.usecase';

@Controller('publicacoes')
export class PublicacoesController {
  constructor(
    private readonly comentarPublicacaoUsecase: ComentarPublicacaoUsecase,
    private readonly getComentariosByPublicacaoUsecase: GetComentariosByPublicacaoUsecase,
    private readonly excluirPublicacaoUsecase: ExcluirPublicacaoUsecase,
    private readonly criarPublicacaoUsecase: CriarPublicacaoUsecase,
    private readonly getFeedUsecase: GetFeedUsecase,
  ) {}

  @Post(':publicacaoId/comentarios')
  public async comentarPublicacao(
    @CurrentUser() usuario: UsuarioAutenticadoDto,
    @Param('publicacaoId', ParseIntPipe) publicacaoId: number,
    @Body() dados: ComentarPublicacaoDto,
  ) {
    return this.comentarPublicacaoUsecase.execute(
      publicacaoId,
      usuario.sub,
      dados,
    );
  }

  @Get(':publicacaoId/comentarios')
  public async getComentariosByPublicacao(
    @Param('publicacaoId', ParseIntPipe) publicacaoId: number,
  ) {
    return this.getComentariosByPublicacaoUsecase.execute(publicacaoId);
  }

  @Delete(':publicacaoId')
  @UseGuards(OwnershipGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async excluirPublicacao(
    @Param('publicacaoId', ParseIntPipe) publicacaoId: number,
  ) {
    await this.excluirPublicacaoUsecase.execute(publicacaoId);
  }

  @Post()
  public async criarPublicacao(
    @CurrentUser() usuario: UsuarioAutenticadoDto,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    if (!request.isMultipart()) {
      throw new BadRequestException('Envie a publicação como formulário.');
    }
    const dados: CriarPublicacaoDto = { conteudo: null, imagem: null };
    for await (const part of request.parts()) {
      if (part.type === 'file') {
        dados.imagem = await getFileBuffer(part);
      } else if (part.fieldname === 'conteudo') {
        dados.conteudo = String(part.value);
      }
    }
    const publicacao = await this.criarPublicacaoUsecase.execute(
      usuario.sub,
      dados,
    );
    reply.header('Location', `/publicacoes/${publicacao.id}`);
    return publicacao;
  }

  @Get()
  public async getFeed(@Query() query: GetFeedQueryDto) {
    return this.getFeedUsecase.execute(query.page, query.limit);
  }
}
