import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User = new User();

  public setUser(user: User): void {
    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }

  public getRole(): string {
    if (!!this.user && !!this.user.role) {
      return this.user.role;
    }
    return '';
  }

}
