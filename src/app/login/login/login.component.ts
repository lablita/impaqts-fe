import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { EmitterService } from 'src/app/utils/emitter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public auth: boolean = false;
  public role: string | null | undefined = null;
  public user: User = new User();

  constructor(
    private readonly authService: AuthService,
    private readonly emitterService: EmitterService
  ) {
    this.init();
  }

  private init(): void {
    this.emitterService.user.subscribe(user => {
      this.role = user.role;
    });
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

}
