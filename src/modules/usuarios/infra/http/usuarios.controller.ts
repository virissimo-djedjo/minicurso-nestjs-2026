import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import SearchUsuarioService from '../../application/services/search-usuario.service';
import { CadastrarUsuarioUsecase } from '../../application/usecases/cadastrar-usuario.usecase';
import { CadastrarUsuarioDto } from '../../application/dto/cadastrar-usuario.dto';
import { GetPerfilUsecase } from '../../application/usecases/get-perfil.usecase';
import { Public } from '../../../common/infra/http/public.decorator';
import { CurrentUser } from '../../../common/infra/http/current-user.decorator';
import type { UsuarioAutenticadoDto } from '../../../common/application/dto/usuario-autenticado.dto';
import { AtualizarImagemPerfilUsecase } from '../../application/usecases/atualizar-imagem-perfil.usecase';
import { getFileBuffer } from '../../../common/infra/http/multipart.util';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly searchUsuarioService: SearchUsuarioService,
    private readonly cadastrarUsuarioUsecase: CadastrarUsuarioUsecase,
    private readonly getPerfilUsecase: GetPerfilUsecase,
    private readonly atualizarImagemPerfilUsecase: AtualizarImagemPerfilUsecase,
  ) {}

  @Get('/:username')
  public async getUsuariosByUsername(@Param('username') username: string) {
    const usuarios = await this.searchUsuarioService.searchByUsername(username);
    return usuarios;
  }

  @Public()
  @Post()
  public async cadastrarUsuario(@Body() dados: CadastrarUsuarioDto) {
    return this.cadastrarUsuarioUsecase.execute(dados);
  }

  @Get('me')
  public async getPerfil(@CurrentUser() usuario: UsuarioAutenticadoDto) {
    return this.getPerfilUsecase.execute(usuario.sub);
  }

  @Put('me/imagem-perfil')
  public async atualizarImagemPerfil(
    @CurrentUser() usuario: UsuarioAutenticadoDto,
    @Req() request: FastifyRequest,
  ) {
    const imagem = request.isMultipart() ? await request.file() : undefined;
    if (!imagem) {
      throw new BadRequestException('Envie uma imagem.');
    }
    return this.atualizarImagemPerfilUsecase.execute(
      usuario.sub,
      await getFileBuffer(imagem),
    );
  }
}
