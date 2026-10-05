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
  AUTH_CREDENCIAIS_INVALIDAS: HttpStatus.UNAUTHORIZED,
  AUTH_USUARIO_INATIVO: HttpStatus.FORBIDDEN,
  AUTH_SESSAO_INVALIDA: HttpStatus.UNAUTHORIZED,
  IMAGEM_TIPO_INVALIDO: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  STORAGE_INDISPONIVEL: HttpStatus.BAD_GATEWAY,
  CEP_NAO_ENCONTRADO: HttpStatus.NOT_FOUND,
  CEP_SERVICO_INDISPONIVEL: HttpStatus.BAD_GATEWAY,
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
