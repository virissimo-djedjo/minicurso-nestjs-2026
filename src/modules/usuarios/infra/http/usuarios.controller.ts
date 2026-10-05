import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import SearchUsuarioService from '../../application/services/search-usuario.service';
import { CadastrarUsuarioUsecase } from '../../application/usecases/cadastrar-usuario.usecase';
import { CadastrarUsuarioDto } from '../../application/dto/cadastrar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly searchUsuarioService: SearchUsuarioService,
    private readonly cadastrarUsuarioUsecase: CadastrarUsuarioUsecase,
  ) {}

  @Get('/:username')
  public async getUsuariosByUsername(@Param('username') username: string) {
    const usuarios = await this.searchUsuarioService.searchByUsername(username);
    return usuarios;
  }

  @Post()
  public async cadastrarUsuario(@Body() dados: CadastrarUsuarioDto) {
    return this.cadastrarUsuarioUsecase.execute(dados);
  }
}
