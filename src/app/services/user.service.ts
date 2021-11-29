import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: string | null = null;
  private email: string | null = null;
  private role: string = '';

  constructor() { }

  public setName(user: string): void {
    this.user = user;
  }

  public getName(): string | null {
    return this.user;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public setRole(role: string): void {
    this.role = role;
  }

  public getRole(): string {
    return this.role;
  }

  public isChanged(email: string | null | undefined): boolean {
    return !!email && (!this.email || email !== this.email);
  }

  public clean(): void {
    this.user = this.email = this.role = ''
  }

  public setUser(user: any) {
    this.setName(user['name']);
    this.setEmail(user['https://impaqts.eu.auth0.meta/email']);
    this.setRole(user['https://impaqts.eu.auth0.meta/role']);
  }

}
