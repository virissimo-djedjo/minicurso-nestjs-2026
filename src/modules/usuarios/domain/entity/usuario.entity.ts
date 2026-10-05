import { CPF } from '../value-objects/cpf';
import { DataNascimento } from '../value-objects/data-nascimento';
import { Email } from '../value-objects/email';
import { NomeUsuario } from '../value-objects/nome-usuario';
import { CreateUsuarioDto, UsuarioStatus } from './usuario.dto';

export class Usuario {
  private constructor(
    readonly nome: string,
    readonly sobrenome: string,
    readonly nomeUsuario: NomeUsuario,
    readonly email: Email,
    readonly senhaHash: string,
    readonly cpf: CPF,
    readonly dataNascimento: DataNascimento,
    readonly status: UsuarioStatus,
    readonly enderecoId: string | null,
  ) {}

  public static create(dados: CreateUsuarioDto): Usuario {
    return new Usuario(
      dados.nome.trim(),
      dados.sobrenome.trim(),
      new NomeUsuario(dados.nomeUsuario),
      new Email(dados.email),
      dados.senhaHash,
      new CPF(dados.cpf),
      new DataNascimento(dados.dataNascimento),
      UsuarioStatus.ATIVO,
      dados.enderecoId,
    );
  }
}
