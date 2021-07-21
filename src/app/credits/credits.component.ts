import { Component, OnInit } from '@angular/core';
import { CREDITS, INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  public credits: string;

  constructor(
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.clickLabel.emit(new KeyValueItem(CREDITS, CREDITS));
    this.credits = (JSON.parse(localStorage.getItem(INSTALLATION)) as Installation).credits;
  }

}
