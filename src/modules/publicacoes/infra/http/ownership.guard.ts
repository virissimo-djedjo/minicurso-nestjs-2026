import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../../common/infra/http/authenticated-request.dto';
import { DOMAIN_EXCEPTION } from '../../../common/domain/exception';
import { PublicacaoRepository } from '../../application/repositories/publicacao.repository';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly publicacaoRepository: PublicacaoRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { publicacaoId } = request.params as { publicacaoId: string };
    if (!/^\d+$/.test(publicacaoId)) {
      throw new BadRequestException('O id da publicação deve ser um número.');
    }
    const autorId = await this.publicacaoRepository.getAutorIdById(
      Number(publicacaoId),
    );
    if (!autorId) {
      throw new NotFoundException(
        DOMAIN_EXCEPTION.PUBLICACAO.NAO_ENCONTRADA.message,
      );
    }
    if (autorId !== request.usuario.sub) {
      throw new ForbiddenException('Só quem publicou pode excluir.');
    }
    return true;
  }
}
