import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { FREQ, REL } from '../common/frequency-constants';
import { REQUEST_TYPE, WORD } from '../common/query-constants';
import { ASC, DESC } from '../model/constants';
import { FieldRequest } from '../model/field-request';
import { FrequencyItem } from '../model/frequency-item';
import { FrequencyResultLine } from '../model/frequency-result-line';
import { KeyValueItem } from '../model/key-value-item';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { ErrorMessagesService } from '../services/error-messages.service';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';

const PAGE_FREQUENCY_FREQUENCY = 'PAGE.FREQUENCY.FREQUENCY';

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
  public lines: Array<FrequencyResultLine> = Array.from<FrequencyResultLine>({ length: 0 });
  public colHeaders: Array<string> = Array.from<string>({ length: 0 });
  public sortField = '';
  public multilevel = false;

  private readonly queryResponseSubscription: Subscription;
  private makeFrequencySubscription: Subscription | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    private readonly queryRequestService: QueryRequestService,
    private readonly errorMessagesService: ErrorMessagesService
  ) {
    this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse) {
        const queryRequest = this.queryRequestService.getQueryRequest();
        if (queryResponse.error && queryResponse.errorResponse && queryResponse.errorResponse.errorCode === 500) {
          const errorMessage = { severity: 'error', summary: 'Errore', detail: 'Errore I/O sul server, i dati potrebbero non essere attendibili' };
          this.errorMessagesService.sendError(errorMessage);
        } else if (queryResponse.frequency && ((
          queryRequest
          && queryRequest.frequencyQueryRequest
          && queryRequest.frequencyQueryRequest.categories
          && queryRequest.frequencyQueryRequest.categories.length > 0)
          ? this.category === queryResponse.frequency.head : true)) {
          this.totalResults = queryResponse.currentSize;
          this.frequency = queryResponse.frequency;
          this.lines = this.frequency.items;
          this.totalItems = this.frequency.total;
          this.totalFrequency = this.frequency.totalFreq;
          this.maxFreq = this.frequency.maxFreq;
          this.maxRel = this.frequency.maxRel;
          this.noResultFound = this.totalItems < 1;
          this.setColumnHeaders();
        }
      }
    });
  }


  ngOnInit(): void {
    this.setColumnHeaders();
  }

  ngAfterViewInit(): void {
    if (!this.makeFrequencySubscription) {
      this.makeFrequencySubscription = this.emitterService.makeFrequency.pipe(first()).subscribe(fieldRequest => {
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

  public clickPositive(event: any): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    const multilevelFrequency = queryRequest.frequencyQueryRequest?.multilevelFrequency;
    const typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayload(
      !!this.fieldRequest ? [new ConcordanceRequest(this.fieldRequest, typeSearch)] : [], 0);
    if (!!multilevelFrequency && multilevelFrequency.length === event.word.length) {
      for (let i = 0; i < event.word.length; i++) {
        multilevelFrequency[i].term = event.word[i];
      }
    }
    queryRequest.queryType = REQUEST_TYPE.POSITIVE_FREQUEQUENCY_CONCORDANCE_QUERY_REQUEST;
    this.emitterService.makeConcordanceRequestSubject.next(concordanceRequestPayload);
    this.titleResult.emit('MENU.CONCORDANCE');
  }

  public clickNegative(event: any): void {
    const typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayload(
      !!this.fieldRequest ? [new ConcordanceRequest(this.fieldRequest, typeSearch)] : [], 0);
    event.word.forEach((w: string, i: number) => {
      const fieldRequest: FieldRequest = new FieldRequest();
      fieldRequest.matchCase = true;
      fieldRequest.word = w;
      fieldRequest.selectedQueryType = new KeyValueItem(WORD, WORD);
      fieldRequest.selectedCorpus = this.corpus;
      concordanceRequestPayload.concordances.push(new ConcordanceRequest(fieldRequest, typeSearch));
      concordanceRequestPayload.pos = i + 1;
    });
    const queryRequest = this.queryRequestService.getQueryRequest();
    queryRequest.frequencyQueryRequest = null;
    this.emitterService.makeConcordanceRequestSubject.next(concordanceRequestPayload);
    this.titleResult.emit('MENU.CONCORDANCE');
  }

  private setColumnHeaders(): void {
    const frequencyQueryRequest = this.queryRequestService.getQueryRequest().frequencyQueryRequest;
    if (frequencyQueryRequest) {
      this.multilevel = frequencyQueryRequest.multilevelFrequency.length > 0;
      const multilevelColHeaders = frequencyQueryRequest.multilevelFrequency.map(mlfreq => mlfreq.attribute ? mlfreq.attribute : '');
      multilevelColHeaders.push(PAGE_FREQUENCY_FREQUENCY);
      this.colHeaders = this.multilevel ? multilevelColHeaders : COL_HEADER_TEXTTYPE;
      this.sortField = `${PAGE_FREQUENCY_FREQUENCY}-${(this.colHeaders.length - 1)}`;
    }
  }

}
