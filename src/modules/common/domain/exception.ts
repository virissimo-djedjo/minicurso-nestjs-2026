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
  USUARIO: {
    JA_CADASTRADO: {
      message: 'Já existe um usuário com este CPF, e-mail ou nome de usuário.',
      domainCode: 'USUARIO_JA_CADASTRADO',
    },
  },
  AUTH: {
    CREDENCIAIS_INVALIDAS: {
      message: 'E-mail ou senha incorretos.',
      domainCode: 'AUTH_CREDENCIAIS_INVALIDAS',
    },
    USUARIO_INATIVO: {
      message: 'Sua conta não está ativa.',
      domainCode: 'AUTH_USUARIO_INATIVO',
    },
    SESSAO_INVALIDA: {
      message: 'Sua sessão não é mais válida. Faça login novamente.',
      domainCode: 'AUTH_SESSAO_INVALIDA',
    },
  },
  EMAIL: {
    INVALID: {
      message: 'O e-mail informado não possui um formato válido.',
      domainCode: 'EMAIL_INVALIDO',
    },
  },
  NOME_USUARIO: {
    INVALID: {
      message:
        'O nome de usuário deve ter de 3 a 35 caracteres entre letras minúsculas, números, _ e ponto.',
      domainCode: 'NOME_USUARIO_INVALIDO',
    },
  },
  IMAGEM: {
    TIPO_INVALIDO: {
      message: 'Só imagens são aceitas (JPG, PNG, WEBP ou GIF).',
      domainCode: 'IMAGEM_TIPO_INVALIDO',
    },
  },
  STORAGE: {
    INDISPONIVEL: {
      message: 'Não foi possível guardar a imagem agora. Tente de novo.',
      domainCode: 'STORAGE_INDISPONIVEL',
    },
  },
  CEP: {
    INVALID: {
      message: 'O CEP deve ter 8 dígitos.',
      domainCode: 'CEP_INVALIDO',
    },
    NAO_ENCONTRADO: {
      message: 'CEP não encontrado.',
      domainCode: 'CEP_NAO_ENCONTRADO',
    },
    SERVICO_INDISPONIVEL: {
      message: 'A consulta de CEP está fora do ar. Tente de novo em instantes.',
      domainCode: 'CEP_SERVICO_INDISPONIVEL',
    },
  },
  PUBLICACAO: {
    VAZIA: {
      message: 'Escreva um texto ou escolha uma imagem para publicar.',
      domainCode: 'PUBLICACAO_VAZIA',
    },
    CONTEUDO_LONGO: {
      message: 'O texto da publicação deve ter no máximo 1000 caracteres.',
      domainCode: 'PUBLICACAO_CONTEUDO_LONGO',
    },
    NAO_ENCONTRADA: {
      message: 'Publicação não encontrada.',
      domainCode: 'PUBLICACAO_NAO_ENCONTRADA',
    },
  },
  COMENTARIO: {
    VAZIO: {
      message: 'Escreva algo para comentar.',
      domainCode: 'COMENTARIO_VAZIO',
    },
  },
} as const;
