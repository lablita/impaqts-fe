export class RoleMenu {
  role: string
  menu: string[] = [];

  constructor(role: string, menu: string[]) {
    this.role = role;
    this.menu = menu;
  }
}
