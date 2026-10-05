import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CadastrarUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  sobrenome: string;

  @IsString()
  @IsNotEmpty()
  nomeUsuario: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  dataNascimento: string;

  @IsOptional()
  @IsString()
  cep?: string;
}

export interface UsuarioCadastradoDto {
  id: string;
  nome: string;
  sobrenome: string;
  nomeUsuario: string;
  email: string;
  dataNascimento: string;
  status: string;
}

export interface UsuarioCadastradoCheckDto {
  isCadastrado: boolean;
}
