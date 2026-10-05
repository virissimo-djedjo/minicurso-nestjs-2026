import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsuarioAutenticadoDto } from '../../application/dto/usuario-autenticado.dto';
import { AuthenticatedRequest } from './authenticated-request.dto';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Faça login para continuar.');
    }
    request.usuario = await this.jwtService
      .verifyAsync<UsuarioAutenticadoDto>(token)
      .catch(() => {
        throw new UnauthorizedException(
          'Sua sessão não é mais válida. Faça login novamente.',
        );
      });
    return true;
  }
}
