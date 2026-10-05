import { FastifyRequest } from 'fastify';
import { UsuarioAutenticadoDto } from '../../application/dto/usuario-autenticado.dto';

export interface AuthenticatedRequest extends FastifyRequest {
  usuario: UsuarioAutenticadoDto;
}
