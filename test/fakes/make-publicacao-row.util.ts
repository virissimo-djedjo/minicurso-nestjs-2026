import { PublicacaoRow } from './fakes.dto';
import { FAKE_CREATED_AT } from './in-memory-publicacao.repository';

export function makePublicacaoRow(
  dados: Partial<PublicacaoRow> = {},
): PublicacaoRow {
  return {
    id: '1',
    usuarioId: '1',
    conteudo: 'Primeira sessão da campanha hoje!',
    imagemUrl: null,
    status: 'PUBLICADA',
    createdAt: FAKE_CREATED_AT,
    deletedAt: null,
    ...dados,
  };
}
