import { Inject, Injectable } from '@nestjs/common';
import UsuarioDBEntity from '../entity/usuario.db.entity';

@Injectable()
export default class UsuarioRepository {
  constructor(@Inject(UsuarioDBEntity) usuarioEntity: UsuarioDBEntity) {}
}
