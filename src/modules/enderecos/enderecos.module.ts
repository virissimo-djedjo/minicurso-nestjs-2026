import { Module } from '@nestjs/common';
import { EnderecoRepository } from './application/repositories/endereco.repository';
import { PostgresEnderecoRepository } from './infra/database/repository/postgres-endereco.repository';
import { CepProviderPort } from './application/ports/cep-provider.port';
import { ViaCepAdapter } from './infra/via-cep/via-cep.adapter';

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: EnderecoRepository, useClass: PostgresEnderecoRepository },
    { provide: CepProviderPort, useClass: ViaCepAdapter },
  ],
  exports: [],
})
export class EnderecosModule {}
