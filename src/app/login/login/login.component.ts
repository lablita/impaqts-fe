import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public auth: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated$;
  }

  public loginWithRedirect(): void {
    this.authService.loginWithRedirect();
  }

  public logout(): void {
    this.userService.clean();
    this.authService.logout();
  }

}
