export class UsuarioModel {
  id: number;
  nome: string;
  sobrenome: string;
  nomeUsuario: string;
  email: string;
  senhaHash: string;
  cpf: string;
  bio: string;
  imagemPerfilUrl: string;
  status: string;
}

export default class Usuario {
  private constructor(
    private readonly id: number,
    private readonly nome: string,
    private readonly sobrenome: string,
    private readonly nomeUsuario: string,
    private readonly email: string,
    private readonly senha: string,
    private readonly cpf: string,
    private readonly bio: string,
    private readonly imagemPerfilUrl: string,
    private readonly status: string,
  ) {}

  getId(): number {
    return this.id;
  }
  getNome(): string {
    return this.nome;
  }
  getSobrenome(): string {
    return this.sobrenome;
  }
  getNomeUsuario(): string {
    return this.nomeUsuario;
  }
  getEmail(): string {
    return this.email;
  }
  getSenhaHash(): string {
    return this.senha;
  }
  getCPF(): string {
    return this.cpf;
  }
  getBio(): string {
    return this.bio;
  }
  getImagemPerfil(): string {
    return this.imagemPerfilUrl;
  }
  getStatus(): string {
    return this.status;
  }
  toString(): UsuarioModel {
    return {
      id: this.getId(),
      nome: this.getNome(),
      sobrenome: this.getSobrenome(),
      nomeUsuario: this.getNomeUsuario(),
      email: this.getEmail(),
      senhaHash: this.getSenhaHash(),
      cpf: this.getCPF(),
      bio: this.getBio(),
      imagemPerfilUrl: this.getImagemPerfil(),
      status: this.getStatus(),
    };
  }
  toJSON(): UsuarioModel {
    return this.toString();
  }
  public static build(usuario: UsuarioModel): Usuario {
    return new Usuario(
      usuario.id,
      usuario.nome,
      usuario.sobrenome,
      usuario.nomeUsuario,
      usuario.email,
      usuario.senhaHash,
      usuario.cpf,
      usuario.bio,
      usuario.imagemPerfilUrl,
      usuario.status,
    );
  }
}
