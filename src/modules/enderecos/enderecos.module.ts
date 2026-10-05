import { Module } from '@nestjs/common';
import { EnderecoRepository } from './application/repositories/endereco.repository';
import { PostgresEnderecoRepository } from './infra/database/repository/postgres-endereco.repository';
import { CepProviderPort } from './application/ports/cep-provider.port';
import { ViaCepAdapter } from './infra/via-cep/via-cep.adapter';
import { CommonModule } from '../common/common.module';
import { GetEnderecoByCepUsecase } from './application/usecases/get-endereco-by-cep.usecase';
import { EnderecosController } from './infra/http/enderecos.controller';

@Module({
  imports: [CommonModule],
  controllers: [EnderecosController],
  providers: [
    { provide: EnderecoRepository, useClass: PostgresEnderecoRepository },
    { provide: CepProviderPort, useClass: ViaCepAdapter },
    GetEnderecoByCepUsecase,
  ],
  exports: [GetEnderecoByCepUsecase],
})
export class EnderecosModule {}
