import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INSTALLATION } from './model/constants';
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
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  ngOnInit(): void {
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    const projectName = this.installation.projectName;
    this.document.getElementById('ico')['href'] = 'http://localhost:9001/impaqts-configurator/favicon?installationName=' + projectName;
    this.document.getElementById('css')['href'] = 'http://localhost:9001/impaqts-configurator/css?installationName=' + projectName;
  }

}
