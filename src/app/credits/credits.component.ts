import { Component, OnInit } from '@angular/core';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { DisplayPanelService } from '../services/display-panel.service';
import { CREDITS_ROUTE } from '../common/routes-constants';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  public credits = '';

  constructor(
    private readonly displayPanelService: DisplayPanelService
  ) { }

  ngOnInit(): void {
    this.displayPanelService.menuItemClickSubject.next(CREDITS_ROUTE);
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.credits = (JSON.parse(inst) as Installation).credits;
    }
  }

}
