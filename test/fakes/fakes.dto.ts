import { UsuarioStatus } from '../../src/modules/usuarios/domain/entity/usuario.dto';
import { EnderecoDto } from '../../src/modules/enderecos/application/dto/endereco.dto';

export interface UsuarioRow {
  id: string;
  nome: string;
  sobrenome: string;
  nomeUsuario: string;
  email: string;
  senhaHash: string;
  cpf: string;
  dataNascimento: string;
  status: UsuarioStatus;
  enderecoId: string | null;
  imagemPerfilUrl: string | null;
  deletedAt: Date | null;
}

export interface StoredFileRow {
  imagem: Buffer;
  contentType: string;
}

export interface EnderecoRow extends EnderecoDto {
  deletedAt: Date | null;
}
