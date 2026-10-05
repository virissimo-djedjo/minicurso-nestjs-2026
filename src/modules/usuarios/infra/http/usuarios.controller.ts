import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import SearchUsuarioService from '../../application/services/search-usuario.service';
import { CadastrarUsuarioUsecase } from '../../application/usecases/cadastrar-usuario.usecase';
import { CadastrarUsuarioDto } from '../../application/dto/cadastrar-usuario.dto';
import { GetPerfilUsecase } from '../../application/usecases/get-perfil.usecase';
import { Public } from '../../../common/infra/http/public.decorator';
import { CurrentUser } from '../../../common/infra/http/current-user.decorator';
import type { UsuarioAutenticadoDto } from '../../../common/application/dto/usuario-autenticado.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly searchUsuarioService: SearchUsuarioService,
    private readonly cadastrarUsuarioUsecase: CadastrarUsuarioUsecase,
    private readonly getPerfilUsecase: GetPerfilUsecase,
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
}
