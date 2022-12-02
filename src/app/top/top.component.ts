import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INSTALLATION, LOGIN, LOGOUT, TOP_LEFT, TOP_RIGHT } from '../model/constants';
import { Installation } from '../model/installation';
import { AuthorizationService } from '../services/authorization.service';
import { EmitterService } from '../utils/emitter.service';
@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})

export class TopComponent {

  public urlTopLeft: string | null = null;
  public urlTopRight: string | null = null;
  public authLabel = '';
  public name: string | null = null;
  public role: string | null = null;
  public email: string | null = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly emitterService: EmitterService,
    private readonly authorizationService: AuthorizationService,
  ) {
    this.init();
  }

  private init(): void {
    this.emitterService.user.subscribe(
      {
        next: user => {
          this.authLabel = !!user.role ? LOGOUT : LOGIN;
        }
      });

    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      const installation = JSON.parse(inst) as Installation;
      if (installation.logos && installation.logos.length > 0) {
        installation.logos.forEach(logo => {
          if (logo.position === TOP_LEFT) {
            this.urlTopLeft = logo.url;
          } else if (logo.position === TOP_RIGHT) {
            this.urlTopRight = logo.url;
          }
        });
      }
    }
  }

  public loginLogout(): void {
    if (this.authLabel === LOGOUT) {
      this.authorizationService.logout();
    } else {
      this.authorizationService.loginWithRedirect();
    }
  }

}
