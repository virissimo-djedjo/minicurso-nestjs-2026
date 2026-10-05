import { Usuario } from '../../domain/entity/usuario.entity';
import { UsuarioCadastradoDto } from '../dto/cadastrar-usuario.dto';
import { SearchUsuarioResultDto } from '../dto/search-usuario.dto';

export abstract class UsuarioRepository {
  abstract searchUsuarioByNomeUsuario(
    username: string,
  ): Promise<SearchUsuarioResultDto[]>;

  abstract hasUsuarioCadastrado(usuario: Usuario): Promise<boolean>;

  abstract save(usuario: Usuario): Promise<UsuarioCadastradoDto>;
}
