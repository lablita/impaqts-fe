import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FREQ, L1, L2, L3, L4, L5, L6, NODE, R1, R2, R3, R4, R5, R6, TAG, WORD } from '../common/frequency-constants';
import { CONCORDANCE_WORD } from '../common/label-constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { FIRST, FOURTH, NODE_CONTEXT, SECOND, THIRD } from '../common/sort-constants';
import { DESC } from '../model/constants';
import { FreqOptions } from '../model/freq-options';
import { FrequencyOption, FrequencyQueryRequest } from '../model/frequency-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';

const FREQ_OPTIONS_QUERY_REQUEST = 'freqOptionsQueryRequest';

const POSITION_LIST = [
  L6, 
  L5, 
  L4, 
  L3, 
  L2, 
  L1, 
  NODE,
  R1, 
  R2, 
  R3, 
  R4, 
  R5, 
  R6
];

const SELECTED_POSITION = [
  NODE,
  NODE,
  NODE,
  NODE
];

const LEVELS = [
  new KeyValueItem(FIRST, 'PAGE.CONCORDANCE.FREQ_OPTIONS.FIRST_LEVEL'),
  new KeyValueItem(SECOND, 'PAGE.CONCORDANCE.FREQ_OPTIONS.SECOND_LEVEL'),
  new KeyValueItem(THIRD, 'PAGE.CONCORDANCE.FREQ_OPTIONS.THIRD_LEVEL'),
  new KeyValueItem(FOURTH, 'PAGE.CONCORDANCE.FREQ_OPTIONS.FOURTH_LEVEL')
];

const MULTI_ATTRIBUTE = [
  new KeyValueItem('word', CONCORDANCE_WORD),
  new KeyValueItem('word', CONCORDANCE_WORD),
  new KeyValueItem('word', CONCORDANCE_WORD),
  new KeyValueItem('word', CONCORDANCE_WORD)
];


@Component({
  selector: 'app-frequency-options-panel',
  templateUrl: './frequency-options-panel.component.html',
  styleUrls: ['./frequency-options-panel.component.scss']
})
export class FrequencyOptionsPanelComponent implements OnInit {

  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public concordanceFrequency = new EventEmitter<void>();

  public freqOptionsQueryRequest: FreqOptions = FreqOptions.build();

  public attributeList: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public levels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedLevel: KeyValueItem | null = null;
  public selectedAttribute: KeyValueItem | null = null;
  public selectedMultiAttribute: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public ignoreCase: Array<boolean> = Array.from<boolean>({ length: 0 });
  public positionList: Array<string> = Array.from<string>({ length: 0 });
  public selectedPosition: Array<string> = Array.from<string>({ length: 0 });
  public isConcordanceFreq = true;
  public metadataAttributes: Array<string> = Array.from<string>({ length: 0 });


  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly metadataQueryService: MetadataQueryService
  ) { }

  ngOnInit(): void {
    if (this.corpusAttributes && this.corpusAttributes.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false, false];
    const foqr = localStorage.getItem(FREQ_OPTIONS_QUERY_REQUEST);
    if (foqr) {
      this.freqOptionsQueryRequest = JSON.parse(foqr);
    }
    this.positionList = POSITION_LIST;
    this.selectedPosition = SELECTED_POSITION;
    this.levels = LEVELS;
    this.selectedMultiAttribute = MULTI_ATTRIBUTE;
    this.metadataAttributes = this.metadataQueryService.getMetadata().map(md => md.name);
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickNodeTags(): void {
    this.callConcordanceFrequency(TAG);
  }

  public clickNodeForms(): void {
    this.callConcordanceFrequency(WORD);
  }

  public removeFrequencyOption(): void {
    this.queryRequestService.resetOptionsRequest();
  }

  public makeConcordanceFreq(): void {
    this.isConcordanceFreq = true;
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.CONC_FREQUENCY_QUERY_REQUEST;
    this.setFrequencyOption(this.isConcordanceFreq);
    this.doMakeFrequency();
  }

  public makeMultilevelFreq(): void {
    this.isConcordanceFreq = false;
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.MULTI_FREQUENCY_QUERY_REQUEST;
    this.setFrequencyOption(this.isConcordanceFreq);
    this.doMakeFrequency();
  }

  public levelCheck(event: any, i: number): void {
    this.freqOptionsQueryRequest.levelSelected = event.checked ? i : i - 1;
    if (event.checked) {
      this.freqOptionsQueryRequest.freqOptionList.forEach((f, index) => f.level = index <= i - 1);
    }
  }

  private setFrequencyOption(isSimpleFreq: boolean): void {
    this.queryRequestService.resetOptionsRequest();
    if (this.freqOptionsQueryRequest) {
      this.queryRequestService.getQueryRequest().frequencyQueryRequest =
        this.frequencyQueryRequestBuild(this.freqOptionsQueryRequest, isSimpleFreq);
      localStorage.setItem(FREQ_OPTIONS_QUERY_REQUEST, JSON.stringify(this.freqOptionsQueryRequest));
    }
  }

  private frequencyQueryRequestBuild(freqOptionsQueryRequest: FreqOptions, isSimpleFreq: boolean): FrequencyQueryRequest {
    const res = new FrequencyQueryRequest();
    res.frequencyColSort = null;
    res.frequencyType = FREQ;
    res.frequencyTypeSort = DESC;
    if (isSimpleFreq) {
      res.frequencyLimit = freqOptionsQueryRequest.freqLimit;
      res.includeCategoriesWithNoHits = freqOptionsQueryRequest.includeCat;
      res.categories = freqOptionsQueryRequest.categories;
    } else {
      res.frequencyLimit = freqOptionsQueryRequest.freqLimitMulti;
      for (let i = 0; i < freqOptionsQueryRequest.levelSelected; i++) {
        const freqOption = new FrequencyOption();
        freqOption.attribute = freqOptionsQueryRequest.freqOptionList[i].attribute;
        freqOption.ignoreCase = freqOptionsQueryRequest.freqOptionList[i].ignoreCase;
        freqOption.position = freqOptionsQueryRequest.freqOptionList[i].position;
        res.multilevelFrequency.push(freqOption);
      }
    }
    return res;
  }

  private getFrequencyOption(): FrequencyQueryRequest | null {
    return this.queryRequestService.getQueryRequest().frequencyQueryRequest;
  }

  private callConcordanceFrequency(attribute: string): void {
    const res = new FrequencyQueryRequest();
    res.frequencyColSort = null;
    res.frequencyType = FREQ;
    res.frequencyTypeSort = DESC;
    res.frequencyLimit = 0;
    const freqOpt = new FrequencyOption();
    freqOpt.attribute = attribute;
    freqOpt.ignoreCase = false;
    freqOpt.position = NODE_CONTEXT;
    res.multilevelFrequency.push(freqOpt);
    this.queryRequestService.getQueryRequest().frequencyQueryRequest = res;
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.MULTI_FREQUENCY_QUERY_REQUEST;
    this.doMakeFrequency();
  }

  private doMakeFrequency(): void {
    this.queryRequestService.resetQueryPattern();
    const basicFieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (basicFieldRequest) {
      const freqencyOption = this.getFrequencyOption();
      if (freqencyOption) {
        this.concordanceFrequency.emit();
      }
    }
  }

}
