import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { INSTALLATION, INTERFACE_LANGUAGE } from './model/constants';
import { Installation } from './model/installation';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private installation: Installation | null = null;

  constructor(
    private readonly translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const lang = !!localStorage.getItem(INTERFACE_LANGUAGE) ? localStorage.getItem(INTERFACE_LANGUAGE) : 'it';
    this.translateService.addLangs(['en', 'it']);
    if (lang) {
      this.translateService.setDefaultLang(lang);
      this.translateService.use(lang);
    }
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
