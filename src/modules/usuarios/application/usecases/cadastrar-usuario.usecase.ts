import { Injectable } from '@nestjs/common';
import { Usuario } from '../../domain/entity/usuario.entity';
import {
  DOMAIN_EXCEPTION,
  DomainException,
} from '../../../common/domain/exception';
import {
  CadastrarUsuarioDto,
  UsuarioCadastradoDto,
} from '../dto/cadastrar-usuario.dto';
import { HashPort } from '../ports/hash.port';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { GetEnderecoByCepUsecase } from '../../../enderecos/application/usecases/get-endereco-by-cep.usecase';

@Injectable()
export class CadastrarUsuarioUsecase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly hashPort: HashPort,
    private readonly getEnderecoByCepUsecase: GetEnderecoByCepUsecase,
  ) {}

  public async execute(
    dados: CadastrarUsuarioDto,
  ): Promise<UsuarioCadastradoDto> {
    const enderecoId = dados.cep
      ? (await this.getEnderecoByCepUsecase.execute(dados.cep)).id
      : null;
    const senhaHash = await this.hashPort.hash(dados.senha);
    const usuario = Usuario.create({ ...dados, senhaHash, enderecoId });
    if (await this.usuarioRepository.hasUsuarioCadastrado(usuario)) {
      throw new DomainException(
        DOMAIN_EXCEPTION.USUARIO.JA_CADASTRADO.message,
        { cause: DOMAIN_EXCEPTION.USUARIO.JA_CADASTRADO.domainCode },
      );
    }
    return this.usuarioRepository.save(usuario);
  }
}
