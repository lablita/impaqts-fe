import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { WordListOptionsQueryRequest } from '../model/word-list-options-query-request';
import { CORPORA_LIST } from '../utils/lookup-tab';

const WORD_LIST_OPTION_QUERY_REQUEST = 'wordListOptionQueryRequest';
@Component({
  selector: 'app-word-list-options-panel',
  templateUrl: './word-list-options-panel.component.html',
  styleUrls: ['./word-list-options-panel.component.scss']
})
export class WordListOptionsPanelComponent implements OnInit {

  public wordListOptionsQueryRequest: WordListOptionsQueryRequest;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.wordListOptionsQueryRequest = localStorage.getItem(WORD_LIST_OPTION_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(WORD_LIST_OPTION_QUERY_REQUEST)) : CORPORA_LIST[environment.corpora].wordListOptionsQueryRequest;
    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
    });

  }

  public clickWordListOption(): void {

  }

}
