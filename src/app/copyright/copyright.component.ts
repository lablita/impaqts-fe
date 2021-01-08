import { Component, OnInit } from '@angular/core';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

  public copyright: string;

  constructor() { }

  ngOnInit(): void {
    this.copyright = (JSON.parse(localStorage.getItem(INSTALLATION)) as Installation).credits;
  }

}
