import { Injectable } from '@nestjs/common';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { PerfilUsuarioDto } from '../dto/perfil-usuario.dto';
import { UsuarioRepository } from '../repositories/usuario.repository';

@Injectable()
export class GetPerfilUsecase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  public async execute(usuarioId: string): Promise<PerfilUsuarioDto> {
    const perfil = await this.usuarioRepository.getPerfilById(usuarioId);
    if (!perfil) {
      throw new DomainException(DOMAIN_EXCEPTION.AUTH.SESSAO_INVALIDA.message, {
        cause: DOMAIN_EXCEPTION.AUTH.SESSAO_INVALIDA.domainCode,
      });
    }
    return perfil;
  }
}
