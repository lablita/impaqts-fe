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
  public title = 'impaqts-fe';
  public installation: Installation;

  constructor(
    private readonly translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const lang = !!localStorage.getItem(INTERFACE_LANGUAGE) ? localStorage.getItem(INTERFACE_LANGUAGE) : 'it';
    this.translateService.addLangs(['en', 'it']);
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }

  ngOnInit(): void {
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    const projectName = this.installation.projectName;
    this.document.getElementById('ico')['href'] = `${environment.installationUrl}/favicon?installationName=${projectName}`;
    this.document.getElementById('css')['href'] = `${environment.installationUrl}/css?installationName=${projectName}`;
  }

}
