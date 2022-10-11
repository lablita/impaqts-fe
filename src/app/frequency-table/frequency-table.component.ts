import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FREQ, REL } from '../common/frequency-constants';
import { WORD } from '../common/query-constants';
import { ASC, DESC } from '../model/constants';
import { FieldRequest } from '../model/field-request';
import { FrequencyItem } from '../model/frequency-item';
import { FrequencyResultLine } from '../model/frequency-result-line';
import { KeyValueItem } from '../model/key-value-item';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { ConcordanceRequestPayLoad, EmitterService } from '../utils/emitter.service';

const COL_HEADER_MULTILEVEL = [
  'PAGE.FREQUENCY.WORD',
  'PAGE.FREQUENCY.LEMMA',
  'PAGE.FREQUENCY.TAG',
  'PAGE.FREQUENCY.WORD_LAST',
  'PAGE.FREQUENCY.FREQUENCY'
];

const COL_HEADER_TEXTTYPE = [
  'PAGE.FREQUENCY.FREQUENCY',
  'PAGE.FREQUENCY.REL',
];
@Component({
  selector: 'app-frequency-table',
  templateUrl: './frequency-table.component.html',
  styleUrls: ['./frequency-table.component.scss']
})
export class FrequencyTableComponent implements OnInit {
  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });
  @Input() public visible = false;
  @Input() public category = '';
  @Input() public first = false;
  @Input() public corpus: KeyValueItem | null = null;
  //@Input() public fieldRequest: FieldRequest | null = null;
  @Output() public titleResult = new EventEmitter<string>();
  
  public loading = false;
  public fieldRequest: FieldRequest | null = null;
  public totalResults = 0;
  public totalFrequency = 0;
  public totalItems = 0;
  public noResultFound = true;
  public frequencies: Array<FrequencyItem> = Array.from<FrequencyItem>({ length: 0 });
  public lines: Array<FrequencyResultLine> = Array.from<FrequencyResultLine>({ length: 0 });
  public colHeader: Array<string> = Array.from<string>({ length: 0 });
  public sortField = '';
  public multilevel = false;
  // public textTypeFirstCol: Array<string> = Array.from<string>({ length: 0 });

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    private readonly queryRequestService: QueryRequestService
  ) {
    this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse && queryResponse.frequencies.length > 0
        && queryResponse.frequencies[0].items.length > 0
        && ((this.queryRequestService.queryRequest && this.queryRequestService.queryRequest.frequencyQueryRequest
          && this.queryRequestService.queryRequest.frequencyQueryRequest?.categories.length > 0)
          ? this.category === queryResponse.frequencies[0].head : true)) {
        this.totalResults = queryResponse.currentSize;
        this.frequencies = queryResponse.frequencies;
        this.lines = this.frequencies[0].items;
        this.totalItems = this.frequencies[0].total;
        this.totalFrequency = this.frequencies[0].totalFreq;
        this.noResultFound = queryResponse.currentSize < 1;

        this.multilevel = this.queryRequestService.queryRequest.frequencyQueryRequest?.multilevelFrequency.length! > 0;
        this.colHeader = this.multilevel ? COL_HEADER_MULTILEVEL : COL_HEADER_TEXTTYPE;
        // this.textTypeFirstCol = this.queryRequestService.queryRequest.frequencyQueryRequest?.categories!;
      }
    });
    this.emitterService.makeFrequency.subscribe(fieldRequest => {
      // this is to remove double spinner. First call is due to empty FieldRequest in behaviour subject initialization
      if (fieldRequest && fieldRequest.selectedCorpus) {
        this.loading = true;
        this.fieldRequest = fieldRequest;
        this.loadResultService.loadResults([fieldRequest]);
      }
    });
  }

  ngOnInit(): void {
    this.multilevel = this.queryRequestService.queryRequest.frequencyQueryRequest?.multilevelFrequency.length! > 0;
    this.colHeader = this.multilevel ? COL_HEADER_MULTILEVEL : COL_HEADER_TEXTTYPE;
  }

  public loadFrequencies(event: any): void {
    if (this.fieldRequest && this.queryRequestService.queryRequest.frequencyQueryRequest) {
      this.loading = true;
      if (event.sortField === '' || event.sortField === 'PAGE.FREQUENCY.FREQUENCY') {
        this.queryRequestService.queryRequest.frequencyQueryRequest.frequencyColSort = FREQ;
      } else if (event.sortField === 'PAGE.FREQUENCY.REL') {
        this.queryRequestService.queryRequest.frequencyQueryRequest.frequencyColSort = REL;
      }
      else {
        this.queryRequestService.queryRequest.frequencyQueryRequest.frequencyColSort = '' + this.colHeader.indexOf(event.sortField);
      }
      this.queryRequestService.queryRequest.frequencyQueryRequest.frequencyTypeSort = event.sortOrder === -1 ? DESC : ASC;
      this.loadResultService.loadResults([this.fieldRequest], event);
    }
  }

  public clickPositive(event: any): void {
    let typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayLoad(!!this.fieldRequest ? [new ConcordanceRequest(this.fieldRequest, typeSearch)] : [],0);
    event.word.forEach((w: string, i: number) => {
      const fieldRequest: FieldRequest = new FieldRequest();
      fieldRequest.matchCase = true;
      fieldRequest.word = w;
      fieldRequest.selectedQueryType = new KeyValueItem(WORD, WORD);
      fieldRequest.selectedCorpus = this.corpus;
      concordanceRequestPayload.concordances.push(new ConcordanceRequest(fieldRequest, typeSearch)); 
      concordanceRequestPayload.pos = i + 1; 
    });

    this.queryRequestService.queryRequest.frequencyQueryRequest = null;
    this.emitterService.makeConcordance.next(concordanceRequestPayload);
    this.titleResult.emit('MENU.CONCORDANCE');
  }

}
