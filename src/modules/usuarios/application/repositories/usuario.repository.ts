import { Usuario } from '../../domain/entity/usuario.entity';
import { UsuarioCadastradoDto } from '../dto/cadastrar-usuario.dto';
import { SearchUsuarioResultDto } from '../dto/search-usuario.dto';
import { CredencialUsuarioDto } from '../dto/autenticar-usuario.dto';
import { PerfilUsuarioDto } from '../dto/perfil-usuario.dto';

export abstract class UsuarioRepository {
  abstract searchUsuarioByNomeUsuario(
    username: string,
  ): Promise<SearchUsuarioResultDto[]>;

  abstract hasUsuarioCadastrado(usuario: Usuario): Promise<boolean>;

  abstract save(usuario: Usuario): Promise<UsuarioCadastradoDto>;

  abstract getCredencialByEmail(
    email: string,
  ): Promise<CredencialUsuarioDto | null>;

  abstract getPerfilById(usuarioId: string): Promise<PerfilUsuarioDto | null>;

  abstract updateImagemPerfilUrl(
    usuarioId: string,
    imagemPerfilUrl: string,
  ): Promise<void>;
}
