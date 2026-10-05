import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { DomainException } from '../../domain/exception';

export const HTTP_STATUS_BY_DOMAIN_CODE: Record<string, HttpStatus> = {
  USUARIO_JA_CADASTRADO: HttpStatus.CONFLICT,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  public catch(exception: DomainException, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>();
    const code = String(exception.cause);
    reply
      .status(HTTP_STATUS_BY_DOMAIN_CODE[code] ?? HttpStatus.BAD_REQUEST)
      .send({ code, message: exception.message });
  }
}
