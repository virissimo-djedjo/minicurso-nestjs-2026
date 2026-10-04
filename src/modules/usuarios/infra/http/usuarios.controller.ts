import { Controller, Get, Param } from '@nestjs/common';
import SearchUsuarioService from '../../application/services/search-usuario.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly searchUsuarioService: SearchUsuarioService) {}

  @Get('/:username')
  public async getUsuariosByUsername(@Param('username') username: string) {
    const usuarios = await this.searchUsuarioService.searchByUsername(username);
    return usuarios;
  }
}
