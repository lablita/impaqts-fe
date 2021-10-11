import { Component, OnInit } from '@angular/core';
import { COPYRIGHT, INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

  public copyright: string = '';

  constructor(
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.clickLabel.emit(new KeyValueItem(COPYRIGHT, COPYRIGHT));
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.copyright = (JSON.parse(inst) as Installation).credits;
    }
  }

}
