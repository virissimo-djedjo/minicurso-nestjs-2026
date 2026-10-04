import { Injectable } from '@nestjs/common';
import UsuarioRepository from '../../infra/database/repository/usuario.repository';
import { UsuarioModel } from '../../domain/entity/usuario.entity';

@Injectable()
export default class SearchUsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  public async searchByUsername(username: string): Promise<UsuarioModel[]> {
    return this.usuarioRepository.searchUsuarioByNomeUsuario(username);
  }
}
