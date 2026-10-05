import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../../../common/infra/http/public.decorator';
import { GetEnderecoByCepUsecase } from '../../application/usecases/get-endereco-by-cep.usecase';

@Controller('enderecos')
export class EnderecosController {
  constructor(
    private readonly getEnderecoByCepUsecase: GetEnderecoByCepUsecase,
  ) {}

  @Public()
  @Get(':cep')
  public async getEnderecoByCep(@Param('cep') cep: string) {
    return this.getEnderecoByCepUsecase.execute(cep);
  }
}
