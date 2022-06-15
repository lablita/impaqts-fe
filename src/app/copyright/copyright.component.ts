import { Component, OnInit } from '@angular/core';
import { COPYRIGHT_ROUTE } from '../common/routes-constants';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { DisplayPanelService } from '../services/display-panel.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

  public copyright = '';

  constructor(
    private readonly displayPanelService: DisplayPanelService
  ) { }

  ngOnInit(): void {
    this.displayPanelService.panelItemSelected = COPYRIGHT_ROUTE;
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.copyright = (JSON.parse(inst) as Installation).credits;
    }
  }

}
