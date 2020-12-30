import { Component } from '@angular/core';
import { INSTALLATION, TOP_LEFT, TOP_RIGHT } from '../model/constants';
import { Installation } from '../model/installation';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent {

  public urlTopLeft: string;
  public urlTopRight: string;

  constructor() {
    const installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    installation.logos.forEach(logo => {
      if (logo.position === TOP_LEFT) {
        this.urlTopLeft = logo.url;
      } else if (logo.position === TOP_RIGHT) {
        this.urlTopRight = logo.url;
      }
    });
  }



}
