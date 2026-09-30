import { Controller, Get } from '@nestjs/common';
import { Usuario, UsuarioModel } from '../../../domain/entity/user.entity';

@Controller('usuarios')
export class UsuariosController {
  @Get('')
  public async getUsuario() {
    const usuarioDto = {
      id: 1,
    } as UsuarioModel;
    return Usuario.build(usuarioDto);
  }
}
