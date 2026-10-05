import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { SearchUsuarioResultDto } from '../dto/search-usuario.dto';

@Injectable()
export default class SearchUsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  public async searchByUsername(
    username: string,
  ): Promise<SearchUsuarioResultDto[]> {
    return this.usuarioRepository.searchUsuarioByNomeUsuario(username);
  }
}
