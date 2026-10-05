import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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
  @HttpCode(HttpStatus.NO_CONTENT)
  public async excluirPublicacao(
    @Param('publicacaoId', ParseIntPipe) publicacaoId: number,
  ) {
    await this.excluirPublicacaoUsecase.execute(publicacaoId);
  }
}
