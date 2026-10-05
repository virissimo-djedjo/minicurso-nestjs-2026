import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AutenticarUsuarioUsecase } from '../../application/usecases/autenticar-usuario.usecase';
import { AutenticarUsuarioDto } from '../../application/dto/autenticar-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly autenticarUsuarioUsecase: AutenticarUsuarioUsecase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dados: AutenticarUsuarioDto) {
    return this.autenticarUsuarioUsecase.execute(dados);
  }
}
