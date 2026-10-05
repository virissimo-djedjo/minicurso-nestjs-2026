import { IsNotEmpty, IsString } from 'class-validator';
import { UsuarioStatus } from '../../domain/entity/usuario.dto';

export class AutenticarUsuarioDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}

export interface AccessTokenDto {
  accessToken: string;
}

export interface CredencialUsuarioDto {
  id: string;
  nomeUsuario: string;
  senhaHash: string;
  status: UsuarioStatus;
}
