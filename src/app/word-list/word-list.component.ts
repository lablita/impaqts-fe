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



  private readonly queryResponseSubscription: Subscription;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly loadResultService: LoadResultsService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly route: ActivatedRoute,
    private readonly wordListService: WordListService
  ) { 
    this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse) {
        const queryRequest = this.queryRequestService.getQueryRequest();
        if (queryResponse.error && queryResponse.errorResponse && queryResponse.errorResponse.errorCode === 500) {
          const errorMessage = { severity: 'error', summary: 'Errore', detail: 'Errore I/O sul server, i dati potrebbero non essere attendibili' };
          this.errorMessagesService.sendError(errorMessage);
        } else if (queryResponse.wordList) {
          this.totalItems = queryResponse.wordList.totalItems ? queryResponse.wordList.totalItems : 0;
          this.totalFrequencies = queryResponse.wordList.totalFreqs ? queryResponse.wordList.totalFreqs : 0;
          this.wordListItems = queryResponse.wordList.items;
        }
      }
    });
  }

  ngOnInit(): void {
    //this.corpus = this.queryRequestService.getCorpus();
    
    
    const selectedCorpus: KeyValueItem = JSON.parse(localStorage.getItem('selectedCorpus')!);
    if (selectedCorpus) {
      this.searchAttribute = this.route.snapshot.data.searchAttribute;
      const queryRequest: QueryRequest = new QueryRequest();
      queryRequest.start = 0;
      queryRequest.end = this.pageSize;
      queryRequest.corpus = selectedCorpus.value;
      const wordListRequest: WordListRequest = new WordListRequest();
      wordListRequest.searchAttribute = this.searchAttribute;
      wordListRequest.sortField = 'freq';
      wordListRequest.sordDir = 'desc';
      queryRequest.wordListRequest = wordListRequest;
      queryRequest.queryType = REQUEST_TYPE.WORD_LIST_REQUEST;
      this.wordListService.getWordList(queryRequest).subscribe(wordList => {
        this.wordListItems = wordList?.items ? wordList?.items : [];
        this.totalFrequencies = wordList?.totalFreqs ? wordList?.totalFreqs : 0;
        this.totalItems = wordList?.totalItems ? wordList?.totalItems : 0;
      })

      // this.corpusName = JSON.parse(selectedCorpus);
      // if (this.corpusName && this.corpusName.value) {
      //   this.corpusInfoService.getCorpusInfo(this.corpusName.value).subscribe(corpusInfo => {
      //     this.corpusInfo = corpusInfo;
      //     if (this.corpusInfo) {
      //       this.corpusStructureTree = this.getTree(this.corpusInfo);
      //     }
      //   });
      // }
    }

  }

  public loadWordList(event: any): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    // if (this.fieldRequest && queryRequest.frequencyQueryRequest) {
    //   this.loading = true;
    //   if (event.sortField === '' || event.sortField.indexOf(PAGE_FREQUENCY_FREQUENCY) >= 0) {
    //     queryRequest.frequencyQueryRequest.frequencyType = FREQ;
    //   } else if (event.sortField.indexOf('PAGE.FREQUENCY.REL') >= 0) {
    //     queryRequest.frequencyQueryRequest.frequencyType = REL;
    //   } else if (event.sortField) {
    //     queryRequest.frequencyQueryRequest.frequencyType = null;
    //     queryRequest.frequencyQueryRequest.frequencyColSort =
    //       (event.sortField as string).substring((event.sortField as string).lastIndexOf('-') + 1);
    //   }
    //   queryRequest.frequencyQueryRequest.frequencyTypeSort = event.sortOrder === -1 ? DESC : ASC;
    //   this.loadResultService.loadResults([this.fieldRequest], event);
    // }
  }

}
