import { CreateEnderecoDto } from '../../src/modules/enderecos/application/dto/endereco.dto';

export function makeEndereco(
  dados: Partial<CreateEnderecoDto> = {},
): CreateEnderecoDto {
  return {
    cep: '01001000',
    logradouro: 'Praça da Sé',
    bairro: 'Sé',
    cidade: 'São Paulo',
    estado: 'SP',
    ...dados,
  };
}
