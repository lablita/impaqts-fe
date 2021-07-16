import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INSTALLATION, INTERFACE_LANGUAGE, TOP_LEFT, TOP_RIGHT } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent {

  public urlTopLeft: string;
  public urlTopRight: string;
  public languages: KeyValueItem[] = [new KeyValueItem('en', 'en'), new KeyValueItem('it', 'it'), new KeyValueItem('fr', 'fr')];
  public selectedLanguage: KeyValueItem;

  constructor(
    private readonly translateService: TranslateService
  ) {
    this.init();
  }

  private init(): void {
    const installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    if (installation.logos?.length > 0) {
      installation.logos.forEach(logo => {
        if (logo.position === TOP_LEFT) {
          this.urlTopLeft = logo.url;
        } else if (logo.position === TOP_RIGHT) {
          this.urlTopRight = logo.url;
        }
      });
    }
    this.selectedLanguage = this.languages.filter(lang => lang.key === localStorage.getItem(INTERFACE_LANGUAGE))[0];
  }

  public selectLanguage(): void {
    localStorage.setItem(INTERFACE_LANGUAGE, this.selectedLanguage.key);
    this.translateService.use(this.selectedLanguage.key);
  }

}
