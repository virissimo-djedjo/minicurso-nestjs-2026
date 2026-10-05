import { CredencialUsuarioDto } from '../../src/modules/usuarios/application/dto/autenticar-usuario.dto';
import { UsuarioCadastradoDto } from '../../src/modules/usuarios/application/dto/cadastrar-usuario.dto';
import { PerfilUsuarioDto } from '../../src/modules/usuarios/application/dto/perfil-usuario.dto';
import { SearchUsuarioResultDto } from '../../src/modules/usuarios/application/dto/search-usuario.dto';
import { UsuarioRepository } from '../../src/modules/usuarios/application/repositories/usuario.repository';
import { Usuario } from '../../src/modules/usuarios/domain/entity/usuario.entity';
import { UsuarioRow } from './fakes.dto';

export class InMemoryUsuarioRepository implements UsuarioRepository {
  readonly usuarios = new Map<string, UsuarioRow>();

  public async searchUsuarioByNomeUsuario(
    username: string,
  ): Promise<SearchUsuarioResultDto[]> {
    return this.getActiveUsuarios()
      .filter((usuario) => usuario.nomeUsuario.includes(username))
      .map(({ id, nome, sobrenome, nomeUsuario, imagemPerfilUrl }) => ({
        id,
        nome,
        sobrenome,
        nomeUsuario,
        imagemPerfilUrl,
      }));
  }

  public async hasUsuarioCadastrado(usuario: Usuario): Promise<boolean> {
    return this.getActiveUsuarios().some(
      (row) =>
        row.cpf === usuario.cpf.getCpf() ||
        row.email === usuario.email.getEmail() ||
        row.nomeUsuario === usuario.nomeUsuario.getNomeUsuario(),
    );
  }

  public async save(usuario: Usuario): Promise<UsuarioCadastradoDto> {
    const row: UsuarioRow = {
      id: String(this.usuarios.size + 1),
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      nomeUsuario: usuario.nomeUsuario.getNomeUsuario(),
      email: usuario.email.getEmail(),
      senhaHash: usuario.senhaHash,
      cpf: usuario.cpf.getCpf(),
      dataNascimento: usuario.dataNascimento.getDataNascimento(),
      status: usuario.status,
      enderecoId: usuario.enderecoId,
      imagemPerfilUrl: null,
      deletedAt: null,
    };
    this.usuarios.set(row.id, row);
    return {
      id: row.id,
      nome: row.nome,
      sobrenome: row.sobrenome,
      nomeUsuario: row.nomeUsuario,
      email: row.email,
      dataNascimento: row.dataNascimento,
      status: row.status,
    };
  }

  public async getCredencialByEmail(
    email: string,
  ): Promise<CredencialUsuarioDto | null> {
    const row = this.getActiveUsuarios().find(
      (usuario) => usuario.email === email,
    );
    return row
      ? {
          id: row.id,
          nomeUsuario: row.nomeUsuario,
          senhaHash: row.senhaHash,
          status: row.status,
        }
      : null;
  }

  public async getPerfilById(
    usuarioId: string,
  ): Promise<PerfilUsuarioDto | null> {
    const row = this.getActiveUsuarios().find(
      (usuario) => usuario.id === usuarioId,
    );
    return row
      ? {
          id: row.id,
          nome: row.nome,
          sobrenome: row.sobrenome,
          nomeUsuario: row.nomeUsuario,
          email: row.email,
          imagemPerfilUrl: row.imagemPerfilUrl,
          endereco: null,
        }
      : null;
  }

  private getActiveUsuarios(): UsuarioRow[] {
    return [...this.usuarios.values()].filter((usuario) => !usuario.deletedAt);
  }
}
