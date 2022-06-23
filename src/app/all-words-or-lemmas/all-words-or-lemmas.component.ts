import { Component, OnInit } from '@angular/core';
import { CORPUS_INFO } from '../common/routes-constants';
import { DisplayPanelService } from '../services/display-panel.service';

@Component({
  selector: 'app-all-words-or-lemmas',
  templateUrl: './all-words-or-lemmas.component.html',
  styleUrls: ['./all-words-or-lemmas.component.scss']
})
export class AllWordsOrLemmasComponent implements OnInit {

  constructor(
    private readonly displayPanelService: DisplayPanelService
  ) { }

  ngOnInit(): void {
    this.displayPanelService.panelItemSelected = CORPUS_INFO;
  }

}
