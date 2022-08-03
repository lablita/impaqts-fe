import { Component, OnInit } from '@angular/core';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { DisplayPanelService } from '../services/display-panel.service';

@Component({
  selector: 'app-copyright',
  styles: ['.demo {background-color: blue}'],
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

  public copyright = '';

  constructor(
    private readonly displayPanelService: DisplayPanelService
  ) { }

  ngOnInit(): void {
    // this.displayPanelService.panelSelectedSubject.next(COPYRIGHT_ROUTE);
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.copyright = (JSON.parse(inst) as Installation).copyright;
    }
  }

}
