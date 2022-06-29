import { Component, OnInit } from '@angular/core';
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
    // this.displayPanelService.panelSelectedSubject.next(CORPUS_INFO);
  }

}
