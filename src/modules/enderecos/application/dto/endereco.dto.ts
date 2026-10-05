export interface CreateEnderecoDto {
  cep: string;
  logradouro: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

export interface EnderecoDto extends CreateEnderecoDto {
  id: string;
}
