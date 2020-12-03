import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'impaqts-fe';

  constructor(
    private readonly translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
