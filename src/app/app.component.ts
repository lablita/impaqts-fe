import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConcordanceService } from './concordance/concordance.service';
import { Installation } from './model/installation';


export const INSTALLATION = 'installation';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'impaqts-fe';
  public installation: Installation;

  constructor(
    private readonly translateService: TranslateService,
    private readonly concordanceService: ConcordanceService
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    if (!localStorage.getItem(INSTALLATION)) {
      this.concordanceService.getInstallation().subscribe(installation => {
        localStorage.setItem(INSTALLATION, JSON.stringify(installation));
      });
    }
  }
}
