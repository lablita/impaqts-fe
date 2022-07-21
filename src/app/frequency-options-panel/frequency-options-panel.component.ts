import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FREQ, L1, L2, L3, L4, L5, L6, NODE, R1, R2, R3, R4, R5, R6 } from '../common/frequency-constants';
import { CONCORDANCE_WORD } from '../common/label-constants';
import { FIRST, FOURTH, NODE_CONTEXT, SECOND, THIRD } from '../common/sort-constants';
import { DESC } from '../model/constants';
import { FreqOptionsQueryRequestDTO } from '../model/freq-options-query-request-dto';
import { FrequencyOption, FrequencyQueryRequest } from '../model/frequency-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequestService } from '../services/query-request.service';

const FREQ_OPTIONS_QUERY_REQUEST = 'freqOptionsQueryRequest';

const POSITION_LIST = [
  new KeyValueItem(L6, L6),
  new KeyValueItem(L5, L5),
  new KeyValueItem(L4, L4),
  new KeyValueItem(L3, L3),
  new KeyValueItem(L2, L2),
  new KeyValueItem(L1, L1),
  new KeyValueItem(NODE_CONTEXT, NODE),
  new KeyValueItem(R1, R1),
  new KeyValueItem(R2, R2),
  new KeyValueItem(R3, R3),
  new KeyValueItem(R4, R4),
  new KeyValueItem(R5, R5),
  new KeyValueItem(R6, R6)
];

const SELECTED_POSITION = [
  new KeyValueItem(NODE, NODE),
  new KeyValueItem(NODE, NODE),
  new KeyValueItem(NODE, NODE),
  new KeyValueItem(NODE, NODE)
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

const METADATA_ATTRIBUTES = [
  'doc.sito',
  'doc.url',
  'doc.categoria',
  'doc.produzione',
  'doc.wordcount'
]

@Component({
  selector: 'app-frequency-options-panel',
  templateUrl: './frequency-options-panel.component.html',
  styleUrls: ['./frequency-options-panel.component.scss']
})
export class FrequencyOptionsPanelComponent implements OnInit {

  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public concordanceFrequency = new EventEmitter<FrequencyQueryRequest>();

  public freqOptionsQueryRequest: FreqOptionsQueryRequestDTO = FreqOptionsQueryRequestDTO.build();

  public attributeList: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public levels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedLevel: KeyValueItem | null = null;
  public selectedAttribute: KeyValueItem | null = null;
  public selectedMultiAttribute: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public ignoreCase: Array<boolean> = Array.from<boolean>({ length: 0 });
  public positionList: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedPosition: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public isSimpleFreq = true;
  public metadataAttributes: Array<string> = Array.from<string>({ length: 0 });


  constructor(
    private readonly queryRequestService: QueryRequestService
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
    this.metadataAttributes = METADATA_ATTRIBUTES;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickNodeTags(): void {
    return;
  }

  public clickNodeForms(): void {
    return;
  }

  public removeFrequencyOption(): void {
    this.queryRequestService.resetOptionsRequest();
  }

  public makeFreq(): void {
    this.isSimpleFreq = true;
    this.setFrequencyOption(true);
    this.concordanceFrequency.emit(this.getFrequencyOption());
  }

  public makeMultilevelFreq(): void {
    this.isSimpleFreq = false;
    this.setFrequencyOption(false);
    this.concordanceFrequency.emit(this.getFrequencyOption());
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
      this.queryRequestService.queryRequest.frequencyQueryRequest = this.frequencyQueryRequestBuild(this.freqOptionsQueryRequest, isSimpleFreq);
      localStorage.setItem(FREQ_OPTIONS_QUERY_REQUEST, JSON.stringify(this.freqOptionsQueryRequest));
    }
  }

  private frequencyQueryRequestBuild(freqOptionsQueryRequest: FreqOptionsQueryRequestDTO, isSimpleFreq: boolean): FrequencyQueryRequest {
    const res = new FrequencyQueryRequest();
    res.frequencyColSort = FREQ;
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

  private getFrequencyOption(): FrequencyQueryRequest {
    return this.queryRequestService.queryRequest.frequencyQueryRequest!;
  }

}
