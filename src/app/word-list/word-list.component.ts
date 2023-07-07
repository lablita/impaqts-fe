import { Component, OnInit } from '@angular/core';
import { DisplayPanelService } from '../services/display-panel.service';
import { ActivatedRoute } from '@angular/router';
import { QueryRequestService } from '../services/query-request.service';
import { WordListItem } from '../model/word-list-item';
import { Subscription } from 'rxjs';
import { LoadResultsService } from '../services/load-results.service';
import { ErrorMessagesService } from '../services/error-messages.service';
import { QueryRequest } from '../model/query-request';
import { WordListRequest } from '../model/word-list-request';
import { WordListService } from '../services/word-list.service';
import { CORPUS_INFO } from '../common/constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { KeyValueItem } from '../model/key-value-item';
import { ASC, DESC } from '../model/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit {

  public corpus?: string;
  public paginations: number[] = [10, 25, 50];
  public loading = false;
  public wordListItems: Array<WordListItem> = [];
  public totalItems = 0;
  public totalFrequencies = 0;
  public sortField = '';
  public pageSize = 10;
  public searchAttribute?: string;

  public title = '';

  //per adesso così, poi quando sarà implementato il WordList panel andrà armonizzato con il queryRequestService
  private queryRequest = new QueryRequest();


  //private readonly queryResponseSubscription: Subscription;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly loadResultService: LoadResultsService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly route: ActivatedRoute,
    private readonly wordListService: WordListService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const corpusFromLS = localStorage.getItem('selectedCorpus');
    if (corpusFromLS && JSON.parse(corpusFromLS) !== null) {
      this.corpus = (JSON.parse(corpusFromLS) as KeyValueItem).value;
      if (this.corpus) {
        this.translateService.stream('PAGE.WORD_LIST.TITLE').subscribe(res => this.title = res);
        this.searchAttribute = this.route.snapshot.data.searchAttribute;
        this.queryRequest.start = 0;
        this.queryRequest.end = this.pageSize;
        this.queryRequest.corpus = this.corpus;
        const wordListRequest: WordListRequest = new WordListRequest();
        wordListRequest.searchAttribute = this.searchAttribute;
        wordListRequest.sortField = 'freq';
        wordListRequest.sortDir = DESC;
        wordListRequest.minFreq = 0;
        wordListRequest.maxFreq = 0;
        this.queryRequest.wordListRequest = wordListRequest;
        this.queryRequest.queryType = REQUEST_TYPE.WORD_LIST_REQUEST;
        this.loading = true;
      } 
    } else {
      this.translateService.stream('PAGE.WORD_LIST.TITLE_NO_CORPUS_SEL').subscribe(res => this.title = res);
    }
  }

  public loadWordList(event: any): void {
    this.loading = true;
      if (this.queryRequest && this.queryRequest.wordListRequest) {
        this.queryRequest.wordListRequest.sortDir = event.sortOrder === -1 ? DESC : ASC;
        this.queryRequest.wordListRequest.sortField = (event.sortField.length < 1 || event.sortField === 'freq') ? "freq" : this.searchAttribute ;
        this.queryRequest.start = event.first;
        this.queryRequest.end = event.first + event.rows;
      }
      this.wordListService.getWordList(this.queryRequest).subscribe(wordList => {
        this.loading = false;
        this.wordListItems = wordList?.items ? wordList?.items : [];
        this.totalFrequencies = wordList?.totalFreqs ? wordList?.totalFreqs : 0;
        this.totalItems = wordList?.totalItems ? wordList?.totalItems : 0;
      })
    }

}
