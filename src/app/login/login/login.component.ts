import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-spa-js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public auth: boolean = false;

  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('PIPPO');
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated$;
  }

  public loginWithRedirect(): void {
    this.authService.loginWithRedirect();
  }

  public logout(): void {
    this.authService.logout();
  }

  public user(): User {
    let user: User;
    return this.authService.user$.subscribe(
      u => {
        return u;
      })

  }

}
