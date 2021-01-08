import { Component, OnInit } from '@angular/core';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  public credits: string;

  constructor() { }

  ngOnInit(): void {
    this.credits = (JSON.parse(localStorage.getItem(INSTALLATION)) as Installation).credits;
  }

}
