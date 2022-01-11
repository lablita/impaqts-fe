import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { INSTALLATION, INTERFACE_LANGUAGE } from './model/constants';
import { Installation } from './model/installation';
import { User } from './model/user';
import { UserService } from './services/user.service';
import { EmitterService } from './utils/emitter.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private installation: Installation | null = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emitterService: EmitterService,
    @Inject(DOCUMENT) private document: Document
  ) {
    let lang;
    if (localStorage.getItem(INTERFACE_LANGUAGE) !== null && localStorage.getItem(INTERFACE_LANGUAGE) !== 'undefined') {
      lang = localStorage.getItem(INTERFACE_LANGUAGE);
    } else {
      lang = 'it';
    }
    this.translateService.addLangs(['en', 'it']);
    if (lang) {
      this.translateService.setDefaultLang(lang);
      this.translateService.use(lang);
    }
    this.authService.user$.subscribe(u => {
      if (!!u) {
        const user: User = new User(u['name'], u['https://impaqts.eu.auth0.meta/email'], u['https://impaqts.eu.auth0.meta/role'])
        this.userService.setUser(user);
        this.emitterService.user.next(user)
      }
    });
  }

  ngOnInit(): void {
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      const projectName = this.installation.projectName;
      if (this.document) {
        const icoElement = this.document.getElementById('ico');
        if (icoElement) {
          (icoElement as any).href = `${environment.installationUrl}/favicon?installationName=${projectName}`;
        }
        const cssElement = this.document.getElementById('css');
        (cssElement as any).href = `${environment.installationUrl}/css?installationName=${projectName}`;
      }
    }
  }

}
