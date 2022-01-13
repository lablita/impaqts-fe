type NullableString = string | null | undefined;
export class User {
  name: NullableString = null;
  email: NullableString = null;
  role: NullableString = null;

  constructor(name?: NullableString, email?: NullableString, role?: NullableString) {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
