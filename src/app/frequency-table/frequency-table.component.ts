import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { HTTP } from '../common/constants';
import { FREQ, REL } from '../common/frequency-constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { DOWNLOAD_CSV } from '../common/routes-constants';
import { ASC, CSV_PAGINATION, DESC } from '../model/constants';
import { FieldRequest } from '../model/field-request';
import { FrequencyItem } from '../model/frequency-item';
import { FrequencyOption } from '../model/frequency-query-request';
import { FrequencyResultLine } from '../model/frequency-result-line';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequest } from '../model/query-request';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { ErrorMessagesService } from '../services/error-messages.service';
import { ExportCsvService } from '../services/export-csv.service';
import { InstallationService } from '../services/installation.service';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';

const PAGE_FREQUENCY_FREQUENCY = 'PAGE.FREQUENCY.FREQUENCY';
const METADATA_FREQUENCY = 'metadata_frequency'
const MULTILEVEL_FREQUENCY = 'multilevel_frequency'

const COL_HEADER_TEXTTYPE = [
  'PAGE.FREQUENCY.FREQUENCY',
  'PAGE.FREQUENCY.REL',
];
@Component({
  selector: 'app-frequency-table',
  templateUrl: './frequency-table.component.html',
  styleUrls: ['./frequency-table.component.scss']
})
export class FrequencyTableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() public visible = false;
  @Input() public category = '';
  @Input() public first = false;
  @Input() public corpus: KeyValueItem | null = null;
  @Output() public titleResult = new EventEmitter<string>();

  public paginations: number[] = [10, 25, 50];
  public loading = false;
  public fieldRequest: FieldRequest | null = null;
  public totalResults = 0;
  public totalFrequency = 0;
  public totalItems = 0;
  public maxFreq = 0;
  public maxRel = 0;
  public noResultFound = true;
  public frequency: FrequencyItem = new FrequencyItem();
  public lines: Array<FrequencyResultLine> = [];
  public colHeaders: Array<string> = [];
  public sortField = '';
  public multilevel = false;
  public operation = '';
  public dlgVisible = false;
  public progressStatus = 0;

  private queryResponseSubscription: Subscription | null = null;
  private makeFrequencySubscription: Subscription | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    public readonly queryRequestService: QueryRequestService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly exportCsvService: ExportCsvService,
    private readonly installationServices: InstallationService
  ) {
    setTimeout(() => {
      this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
        this.loading = false;
        if (queryResponse) {
          const queryRequest = this.queryRequestService.getQueryRequest();
          if (queryResponse.error && queryResponse.errorResponse) {
            const errorMessage = { severity: 'error', summary: 'Errore', detail: 'Errore I/O sul server, i dati potrebbero non essere attendibili' };
            if (queryResponse.errorResponse.errorCode === 500) {
              this.errorMessagesService.sendError(errorMessage);
            } else if (queryResponse.errorResponse.errorCode === 400) {
              errorMessage.detail = queryResponse.errorResponse.errorMessage;
              this.errorMessagesService.sendError(errorMessage);
            }
            this.initVariables();
          } else if (queryResponse.frequency && ((
            queryRequest
            && queryRequest.frequencyQueryRequest
            && queryRequest.frequencyQueryRequest.categories
            && queryRequest.frequencyQueryRequest.categories.length > 0)
            ? this.category === queryResponse.frequency.head : true)) {
            this.totalResults = queryResponse.currentSize;
            this.frequency = queryResponse.frequency;
            this.lines = this.frequency.items;
            this.lines.forEach(line => {
              line.word = line.word.map(w => {
                return w.replace(/\u000b/g, ' ');
              });
            });
            this.totalItems = this.frequency.total;
            this.totalFrequency = this.frequency.totalFreq;
            this.maxFreq = this.frequency.maxFreq;
            this.maxRel = this.frequency.maxRel;
            this.operation = this.frequency.operation;
            this.noResultFound = this.totalItems < 1;
            this.setColumnHeaders();
          }
        }
      });
    }, 0);

  }

  ngOnInit(): void {
    this.setColumnHeaders();
  }

  ngAfterViewInit(): void {
    if (!this.makeFrequencySubscription) {
      this.makeFrequencySubscription = this.emitterService.makeFrequency.subscribe(fieldRequest => {
        // this is to remove double spinner. First call is due to empty FieldRequest in behaviour subject initialization
        if (fieldRequest && fieldRequest.selectedCorpus) {
          this.loading = true;
          this.fieldRequest = fieldRequest;
          const queryRequest = this.queryRequestService.getQueryRequest();
          if (queryRequest && queryRequest.frequencyQueryRequest) {
            queryRequest.frequencyQueryRequest.category = this.category;
            this.loadResultService.loadResults([fieldRequest]);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.queryResponseSubscription) {
      this.queryResponseSubscription.unsubscribe();
    }
    if (this.makeFrequencySubscription) {
      this.makeFrequencySubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && changes.visible.currentValue === false) {
      if (this.queryResponseSubscription) {
        this.queryResponseSubscription.unsubscribe();
      }
      if (this.makeFrequencySubscription) {
        this.makeFrequencySubscription.unsubscribe();
      }
    }
  }

  public showDialog(category: string) {
    this.dlgVisible = true;
    this.downloadCsv(category);
  }

  public downloadCsv(category: string): void {
    let timeInterval: Subscription | null = null;
    let previousProgressValue = 0;
    const stopPolling = new Subject();
    const queryRequest: QueryRequest = _.cloneDeep(this.queryRequestService.getQueryRequest());
    if (queryRequest && queryRequest.frequencyQueryRequest) {
      queryRequest.frequencyQueryRequest.category = category;
      queryRequest.end = CSV_PAGINATION;
      this.exportCsvService.exportCvs(queryRequest).subscribe((uuid) => {
        const endpoint = this.installationServices.getCompleteEndpoint(queryRequest.corpus, HTTP);
        const filename = queryRequest.queryType === REQUEST_TYPE.MULTI_FREQUENCY_QUERY_REQUEST ? MULTILEVEL_FREQUENCY : `${METADATA_FREQUENCY}_${category}`;
        const downloadUrl = `${endpoint}/${DOWNLOAD_CSV}/${filename}/${uuid}`;
        //polling on csv progress status
        timeInterval = timer(1000, 2000)
          .pipe(
            switchMap(() => this.exportCsvService.getCsvProgressValue(queryRequest.corpus, uuid)),
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

  public loadFrequencies(event: any): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    if (this.fieldRequest && queryRequest.frequencyQueryRequest) {
      this.loading = true;
      if (event.sortField === '' || event.sortField.indexOf(PAGE_FREQUENCY_FREQUENCY) >= 0) {
        queryRequest.frequencyQueryRequest.frequencyType = FREQ;
      } else if (event.sortField.indexOf('PAGE.FREQUENCY.REL') >= 0) {
        queryRequest.frequencyQueryRequest.frequencyType = REL;
      } else if (event.sortField) {
        queryRequest.frequencyQueryRequest.frequencyType = null;
        queryRequest.frequencyQueryRequest.frequencyColSort =
          (event.sortField as string).substring((event.sortField as string).lastIndexOf('-') + 1);
      }
      queryRequest.frequencyQueryRequest.frequencyTypeSort = event.sortOrder === -1 ? DESC : ASC;
      this.loadResultService.loadResults([this.fieldRequest], event);
    }
  }

  public clickPN(event: any, positive: boolean): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    const typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayload(
      !!this.fieldRequest ? [new ConcordanceRequest(this.fieldRequest, typeSearch)] : [], 0);
    if (queryRequest.frequencyQueryRequest) {
      queryRequest.frequencyQueryRequest.positive = positive;
    }
    if (this.operation === REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST) {
      const freqOptList = queryRequest.frequencyQueryRequest?.freqOptList;
      if (!!freqOptList && freqOptList.length === event.word.length) {
        for (let i = 0; i < event.word.length; i++) {
          freqOptList[i].term = event.word[i];
        }
      }
      queryRequest.queryType = REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST;
    } else {
      const freqOpt = new FrequencyOption();
      freqOpt.term = event.word[0];
      queryRequest.frequencyQueryRequest?.freqOptList.push(freqOpt);
      queryRequest.queryType = REQUEST_TYPE.PN_METADATA_FREQ_CONCORDANCE_QUERY_REQUEST;
    }
    this.emitterService.makeConcordanceRequestSubject.next(concordanceRequestPayload);
    this.emitterService.elaborationSubject.next('concordance');
  }

  private setColumnHeaders(): void {
    const frequencyQueryRequest = this.queryRequestService.getQueryRequest().frequencyQueryRequest;
    if (frequencyQueryRequest) {
      this.multilevel = frequencyQueryRequest.freqOptList.length > 0;
      const multilevelColHeaders = frequencyQueryRequest.freqOptList.map(freqOpt => freqOpt.attribute ? freqOpt.attribute : '');
      multilevelColHeaders.push(PAGE_FREQUENCY_FREQUENCY);
      this.colHeaders = this.multilevel ? multilevelColHeaders : COL_HEADER_TEXTTYPE;
      this.sortField = `${PAGE_FREQUENCY_FREQUENCY}-${(this.colHeaders.length - 1)}`;
    }
  }

  private initVariables(): void {
    this.noResultFound = true;
    this.totalResults = 0;
    this.frequency = new FrequencyItem();
    this.lines = [];
    this.totalItems = 0;
    this.totalFrequency = 0;
    this.maxFreq = 0;
    this.maxRel = 0;
    this.operation = '';
  }

}
