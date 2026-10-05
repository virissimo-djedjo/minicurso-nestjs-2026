export class NomeUsuario {
  private readonly nomeUsuario: string;

  constructor(value: string) {
    this.nomeUsuario = value.trim().toLowerCase();
  }

  public getNomeUsuario(): string {
    return this.nomeUsuario;
  }
}
