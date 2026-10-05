export class Email {
  private readonly email: string;

  constructor(value: string) {
    this.email = value.trim().toLowerCase();
  }

  public getEmail(): string {
    return this.email;
  }
}
