import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { HTTP } from '../common/constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { COMPLETE_FREQUENCY_LIST } from '../common/routes-constants';
import { ASC, DESC } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequest } from '../model/query-request';
import { WordListItem } from '../model/word-list-item';
import { WordListRequest } from '../model/word-list-request';
import { ErrorMessagesService } from '../services/error-messages.service';
import { ExportCsvService } from '../services/export-csv.service';
import { InstallationService } from '../services/installation.service';
import { WordListService } from '../services/word-list.service';
import { CorpusSelectionService } from '../services/corpus-selection.service';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
})
export class WordListComponent implements OnInit, OnDestroy {
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
  public progressStatus = 5;

  //per adesso così, poi quando sarà implementato il WordList panel andrà armonizzato con il queryRequestService
  private queryRequest = new QueryRequest();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly wordListService: WordListService,
    private readonly translateService: TranslateService,
    private readonly exportCsvService: ExportCsvService,
    private readonly installationService: InstallationService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly corpusSelectionService: CorpusSelectionService
  ) {}

  ngOnInit(): void {
    const corpusFromLS = localStorage.getItem('selectedCorpus');
    if (corpusFromLS && JSON.parse(corpusFromLS) !== null) {
      this.corpus = (JSON.parse(corpusFromLS) as KeyValueItem).value;
      if (this.corpus) {
        this.searchAttribute = this.route.snapshot.data.searchAttribute;
        this.translateService
          .stream('PAGE.WORD_LIST.TITLE')
          .subscribe(
            (res) => (this.title = res + ' - ' + this.searchAttribute)
          );
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
      this.translateService
        .stream('PAGE.WORD_LIST.TITLE_NO_CORPUS_SEL')
        .subscribe((res) => (this.title = res));
    }

    // this.corpusSelectionService.corpusSelectedSubject.subscribe(selectedCorpus => {
    //   this.corpusName = selectedCorpus;
    //   this.retrieveCorpusInfo();
    // });

  }

  ngOnDestroy(): void {
    if (this.corpusSelectionService.corpusSelectedSubject) {
      this.corpusSelectionService.corpusSelectedSubject.unsubscribe();
    }
  }

  public loadWordList(event: any): void {
    this.loading = true;
    if (this.queryRequest && this.queryRequest.wordListRequest) {
      this.queryRequest.wordListRequest.sortDir =
        event.sortOrder === -1 ? DESC : ASC;
      this.queryRequest.wordListRequest.sortField =
        event.sortField.length < 1 || event.sortField === 'freq'
          ? 'freq'
          : this.searchAttribute;
      this.queryRequest.start = event.first;
      this.queryRequest.end = event.first + event.rows;
    }
    this.wordListService
      .getWordList(this.queryRequest)
      .subscribe((wordList) => {
        this.loading = false;
        this.wordListItems = wordList?.items ? wordList?.items : [];
        this.totalFrequencies = wordList?.totalFreqs ? wordList?.totalFreqs : 0;
        this.totalItems = wordList?.totalItems ? wordList?.totalItems : 0;
      });
  }

  public downloadCsv(): void {
    const endpoint = this.installationService.getCompleteEndpoint(
      this.queryRequest.corpus,
      HTTP
    );
    const downloadUrl = `${endpoint}/${COMPLETE_FREQUENCY_LIST}/${this.corpus}/${this.queryRequest.wordListRequest?.searchAttribute}`;
    this.exportCsvService
      .download(downloadUrl)
      .then()
      .catch((error) => {
        const errMsg = {} as Message;
        errMsg.severity = 'error';
        errMsg.detail = 'Il file richiesto non è stato generato';
        errMsg.summary = 'Errore';
        this.errorMessagesService.sendError(errMsg);
      });
  }
}
