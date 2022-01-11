export class User {
  name: string | null | undefined = null;
  email: string | null | undefined = null;
  role: string | null | undefined = null;

  constructor(name?: string | null | undefined, email?: string | null | undefined, role?: string | null | undefined) {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}