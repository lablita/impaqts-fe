import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INSTALLATION, INTERFACE_LANGUAGE, LOGIN, LOGOUT, TOP_LEFT, TOP_RIGHT } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { AuthorizationService } from '../services/authorization.service';
import { EmitterService } from '../utils/emitter.service';
@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TopComponent {

  public urlTopLeft: string | null = null;
  public urlTopRight: string | null = null;
  public languages: KeyValueItem[] = [new KeyValueItem('en', 'EN'), new KeyValueItem('it', 'IT')];
  public selectedLanguage: KeyValueItem | null = null;
  public authLabel = '';
  public name: string | null = null;
  public role: string | null = null;
  public email: string | null = null;
  public selectedLang = '';

  constructor(
    private readonly translateService: TranslateService,
    private readonly emitterService: EmitterService,
    private readonly authorizationService: AuthorizationService,
  ) {
    this.init();
  }

  private init(): void {
    this.selectedLang = this.translateService.currentLang;
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
    this.selectedLanguage = this.languages.filter(lang => lang.key === localStorage.getItem(INTERFACE_LANGUAGE))[0];
    if (!this.selectedLanguage) {
      this.selectedLanguage = new KeyValueItem(
        this.translateService.defaultLang.toLowerCase(),
        this.translateService.defaultLang.toUpperCase());
    }
  }

  public selectLanguage(event: any): void {
    if (event) {
      localStorage.setItem(INTERFACE_LANGUAGE, event.value);
      this.translateService.use(event.value);
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
