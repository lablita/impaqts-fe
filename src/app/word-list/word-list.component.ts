import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordListItem } from '../model/word-list-item';
import { QueryRequest } from '../model/query-request';
import { WordListRequest } from '../model/word-list-request';
import { WordListService } from '../services/word-list.service';
import { REQUEST_TYPE } from '../common/query-constants';
import { KeyValueItem } from '../model/key-value-item';
import { ASC, CSV_PAGINATION, DESC } from '../model/constants';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, timer } from 'rxjs';
import { ExportCsvService } from '../services/export-csv.service';
import { HTTP } from '../common/constants';
import { InstallationService } from '../services/installation.service';
import { DOWNLOAD_CSV } from '../common/routes-constants';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


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
  public dlgVisible = false;
  public progressStatus = 5;

  //per adesso così, poi quando sarà implementato il WordList panel andrà armonizzato con il queryRequestService
  private queryRequest = new QueryRequest();


  constructor(
    private readonly route: ActivatedRoute,
    private readonly wordListService: WordListService,
    private readonly translateService: TranslateService,
    private readonly exportCsvService: ExportCsvService,
    private readonly installationServices: InstallationService
  ) { }

  ngOnInit(): void {
    const corpusFromLS = localStorage.getItem('selectedCorpus');
    if (corpusFromLS && JSON.parse(corpusFromLS) !== null) {
      this.corpus = (JSON.parse(corpusFromLS) as KeyValueItem).value;
      if (this.corpus) {
        this.searchAttribute = this.route.snapshot.data.searchAttribute;
        this.translateService.stream('PAGE.WORD_LIST.TITLE').subscribe(res => this.title = res + ' - ' + this.searchAttribute);
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

  public showDialog() {
    this.dlgVisible = true;
    this.downloadCsv();
  }

  public downloadCsv(): void {
    let timeInterval: Subscription | null = null;
    let previousProgressValue = 0;
    const stopPolling = new Subject();
    if (this.queryRequest && this.queryRequest.wordListRequest) {
        this.queryRequest.end = CSV_PAGINATION;
        this.exportCsvService.exportCvs(this.queryRequest).subscribe((uuid) => {
        const endpoint = this.installationServices.getCompleteEndpoint(this.queryRequest.corpus, HTTP);
        const filename = this.queryRequest.wordListRequest?.searchAttribute;
        const downloadUrl = `${endpoint}/${DOWNLOAD_CSV}/${filename}/${uuid}`;
         //polling on csv progress status
         timeInterval = timer(1000, 2000)
         .pipe(
           switchMap(() => this.exportCsvService.getCsvProgressValue(this.queryRequest.corpus, uuid)),
           tap(res => {
             if (res.status === 'OK' || res.status === 'KO') {
               this.dlgVisible = false;
               this.exportCsvService.download(downloadUrl).then();
               stopPolling.next();
             } else if (res.status === 'KK') {
                this.progressStatus = previousProgressValue;
             } else {
               previousProgressValue = +res.status!;
               this.progressStatus = +res.status!;
             }
           }),
           takeUntil(stopPolling)
         ).subscribe();  
       });
    }
  }

}
