export class DomainException extends Error {
  constructor(message: string, context: ErrorOptions) {
    super(message, context);
  }
}

export const DOMAIN_EXCEPTION = {
  CPF: {
    INVALID: {
      message: 'O cpf informado não possui um valor válido.',
      domainCode: 'CPF_INVALIDO',
    },
    FALHA_VALIDACAO: {
      message: 'A validação para o cpf informado falhou.',
      domainCode: 'CPF_FALHOU_VALIDACAO',
    },
    INVALID_LENGTH: {
      message: 'Um cpf válido deve possuir 11 dígitos.',
      domainCode: 'CPF_TAMANHO_INVALIDO',
    },
  },
  DATA_NASCIMENTO: {
    INVALID: {
      message: 'A data de nascimento informada não possui valor válido',
      domainCode: 'DATA_NASCIMENTO_INVALID',
    },
    VALOR_FUTURO: {
      message: 'A data de nascimento informada possuí um valor futuro.',
      domainCode: 'DATA_NASCIMENTO_VALOR_FUTURO',
    },
    IDADE_MINIMA: {
      message: 'A idade mínima para usar o sistema é de 16 anos.',
      domainCode: 'DATA_NASCIMENTO_IDADE_MINIMA',
    },
  },
} as const;
