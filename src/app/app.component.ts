import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Installation } from './model/installation';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'impaqts-fe';
  public installation: Installation;

  constructor(
    private readonly translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
