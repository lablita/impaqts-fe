import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FREQ_OPTIONS_QUERY_REQUEST } from '../common/constants';
import { FREQ, L1, L2, L3, L4, L5, L6, NODE, R1, R2, R3, R4, R5, R6, TAG, WORD } from '../common/frequency-constants';
import { CONCORDANCE_WORD } from '../common/label-constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { FIRST, FOURTH, NODE_CONTEXT, SECOND, THIRD } from '../common/sort-constants';
import { DESC } from '../model/constants';
import { FreqOptions } from '../model/freq-options';
import { FrequencyOption, FrequencyQueryRequest } from '../model/frequency-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { AppInitializerService } from '../services/app-initializer.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';

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

  @Input() public corpusAttributes: KeyValueItem[] = [];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public metadataFrequency = new EventEmitter<void>();

  public freqOptionsQueryRequest: FreqOptions = FreqOptions.build();

  public attributeList: Array<KeyValueItem> = [];
  public levels: Array<KeyValueItem> = [];
  public selectedLevel: KeyValueItem | null = null;
  public selectedAttribute: KeyValueItem | null = null;
  public selectedMultiAttribute: Array<KeyValueItem> = [];
  public ignoreCase: Array<boolean> = [];
  public positionList: Array<string> = [];
  public selectedPosition: Array<string> = [];
  public isMetadataFreq = true;
  public metadataAttributes: Array<string> = [];
  public freqMetadataLabel = 'PAGE.CONCORDANCE.FREQ_OPTIONS.METADATA_FREQ';

  private isImpaqtsCustom: boolean = false;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly appInitializerService: AppInitializerService,
    private readonly emitterService: EmitterService
  ) {
    if (this.appInitializerService.isImpactCustom()) {
      this.freqMetadataLabel = 'PAGE.CONCORDANCE.FREQ_OPTIONS.FILTERS_FREQ';
    }
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
  }

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
    this.metadataAttributes = this.isImpaqtsCustom ?
      this.metadataQueryService.getMetadata4Frequency().map(md => md.name) : this.metadataQueryService.getMetadata().map(md => md.name);
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickNodeTags(): void {
    this.callMetadataFrequency(TAG);
  }

  public clickNodeForms(): void {
    this.callMetadataFrequency(WORD);
  }

  public removeFrequencyOption(): void {
    this.freqOptionsQueryRequest.categories = [];
    this.freqOptionsQueryRequest.freqLimit = 0;
    this.freqOptionsQueryRequest.includeCat = false;
    this.queryRequestService.resetFrequencyOptRequest();
  }

  public removeMultiFrequencyOption(): void {
    this.freqOptionsQueryRequest.levelSelected = 0;
    this.freqOptionsQueryRequest.freqLimitMulti = 0;
    this.freqOptionsQueryRequest.freqOptionList.forEach(opt => opt.level = false);
    this.freqOptionsQueryRequest.freqOptionList.forEach(opt => opt.ignoreCase = false);
    this.freqOptionsQueryRequest.freqOptionList.forEach(opt => opt.attribute = WORD);
    this.freqOptionsQueryRequest.freqOptionList.forEach(opt => opt.position = NODE);
    this.queryRequestService.resetFrequencyOptRequest();
  }



  public makeMetadataFreq(): void {
    this.isMetadataFreq = true;
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.METADATA_FREQUENCY_QUERY_REQUEST;
    this.queryRequestService.getQueryRequest().frequencyQueryRequest = new FrequencyQueryRequest();
    this.setFrequencyOption(this.isMetadataFreq);
    this.doMakeFrequency();
  }

  public makeMultilevelFreq(): void {
    this.isMetadataFreq = false;
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.MULTI_FREQUENCY_QUERY_REQUEST;
    this.setFrequencyOption(this.isMetadataFreq);
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
        res.freqOptList.push(freqOption);
      }
    }
    return res;
  }

  private getFrequencyOption(): FrequencyQueryRequest | null {
    return this.queryRequestService.getQueryRequest().frequencyQueryRequest;
  }

  private callMetadataFrequency(attribute: string): void {
    const res = new FrequencyQueryRequest();
    res.frequencyColSort = null;
    res.frequencyType = FREQ;
    res.frequencyTypeSort = DESC;
    res.frequencyLimit = 0;
    const freqOpt = new FrequencyOption();
    freqOpt.attribute = attribute;
    freqOpt.ignoreCase = false;
    freqOpt.position = NODE_CONTEXT;
    res.freqOptList.push(freqOpt);
    this.queryRequestService.getQueryRequest().frequencyQueryRequest = res;
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.MULTI_FREQUENCY_QUERY_REQUEST;
    this.doMakeFrequency();
  }

  private doMakeFrequency(): void {
    this.emitterService.elaborationSubject.next('frequency');
    this.queryRequestService.resetQueryPattern();
    const basicFieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (basicFieldRequest) {
      const frequencyOption = this.getFrequencyOption();
      if (frequencyOption) {
        this.metadataFrequency.emit();
      }
    }
  }

}
