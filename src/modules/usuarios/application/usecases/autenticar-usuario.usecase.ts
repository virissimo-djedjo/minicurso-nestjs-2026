import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import { UsuarioAutenticadoDto } from '../../../common/application/dto/usuario-autenticado.dto';
import { UsuarioStatus } from '../../domain/entity/usuario.dto';
import { Email } from '../../domain/value-objects/email';
import {
  AccessTokenDto,
  AutenticarUsuarioDto,
} from '../dto/autenticar-usuario.dto';
import { HashPort } from '../ports/hash.port';
import { UsuarioRepository } from '../repositories/usuario.repository';

const UNKNOWN_EMAIL_SENHA_HASH =
  '631feac825a0091f17041cff36bb48c3:03d4c40fc600daadc89fbd7f5f34e7123fe8afa5b85626201045e6913552f40ff997351d55b7cf5748c1f07a9c75372429a77b6541c57d18ac027e766bc04336';

@Injectable()
export class AutenticarUsuarioUsecase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly hashPort: HashPort,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(dados: AutenticarUsuarioDto): Promise<AccessTokenDto> {
    const email = new Email(dados.email).getEmail();
    const credencial = await this.usuarioRepository.getCredencialByEmail(email);
    const isSenhaCorreta = await this.hashPort.compare(
      dados.senha,
      credencial?.senhaHash ?? UNKNOWN_EMAIL_SENHA_HASH,
    );
    if (!credencial || !isSenhaCorreta) {
      throw new DomainException(
        DOMAIN_EXCEPTION.AUTH.CREDENCIAIS_INVALIDAS.message,
        { cause: DOMAIN_EXCEPTION.AUTH.CREDENCIAIS_INVALIDAS.domainCode },
      );
    }
    if (credencial.status !== UsuarioStatus.ATIVO) {
      throw new DomainException(DOMAIN_EXCEPTION.AUTH.USUARIO_INATIVO.message, {
        cause: DOMAIN_EXCEPTION.AUTH.USUARIO_INATIVO.domainCode,
      });
    }
    const payload: UsuarioAutenticadoDto = {
      sub: credencial.id,
      nomeUsuario: credencial.nomeUsuario,
    };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
