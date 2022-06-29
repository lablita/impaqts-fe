import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { L1, L2, L3, L4, L5, L6, NODE, R1, R2, R3, R4, R5, R6 } from '../common/frequency-constants';
import { CONCORDANCE_WORD } from '../common/label-constants';
import { FIRST, FOURTH, SECOND, THIRD } from '../common/sort-constants';
import { DEFAULT_FREQUENCY_QUERY_REQUEST, FreqOptionsQueryRequest } from '../model/freq-options-query_request';
import { KeyValueItem } from '../model/key-value-item';

const FREQ_OPTIONS_QUERY_REQUEST = 'freqOptionsQueryRequest';

@Component({
  selector: 'app-frequency-options-panel',
  templateUrl: './frequency-options-panel.component.html',
  styleUrls: ['./frequency-options-panel.component.scss']
})
export class FrequencyOptionsPanelComponent implements OnInit {

  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public freqOptionsQueryRequest: FreqOptionsQueryRequest = FreqOptionsQueryRequest.getInstance();

  public attributeList: Array<KeyValueItem> = [];
  public levels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedLevel: KeyValueItem | null = null;
  public selectedAttribute: KeyValueItem | null = null;
  public selectedMultiAttribute: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public ignoreCase: Array<boolean> = Array.from<boolean>({ length: 0 });
  public positionList: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedPosition: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public ignoreCaseLabel = '';
  public includeCatLabel = ''

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.corpusAttributes && this.corpusAttributes.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false, false];
    const foqr = localStorage.getItem(FREQ_OPTIONS_QUERY_REQUEST)
    this.freqOptionsQueryRequest = foqr ? JSON.parse(foqr) : DEFAULT_FREQUENCY_QUERY_REQUEST;

    this.positionList = [
      new KeyValueItem(L6, L6),
      new KeyValueItem(L5, L5),
      new KeyValueItem(L4, L4),
      new KeyValueItem(L3, L3),
      new KeyValueItem(L2, L2),
      new KeyValueItem(L1, L1),
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(R6, R6),
      new KeyValueItem(R5, R5),
      new KeyValueItem(R4, R4),
      new KeyValueItem(R3, R3),
      new KeyValueItem(R2, R2),
      new KeyValueItem(R1, R1)
    ];

    this.selectedPosition = [
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(NODE, NODE)
    ];

    this.translateService.stream(CONCORDANCE_WORD).subscribe({
      next: res => {
        this.selectedMultiAttribute = [];
        this.selectedMultiAttribute.push(new KeyValueItem('word', res));
        this.selectedMultiAttribute.push(new KeyValueItem('word', res));
        this.selectedMultiAttribute.push(new KeyValueItem('word', res));
        this.selectedMultiAttribute.push(new KeyValueItem('word', res));
      }
    });
    this.translateService.stream('PAGE.CONCORDANCE.FREQ_OPTIONS.INCLUDE_CAT').subscribe({ next: res => this.includeCatLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.IGNORE_CASE').subscribe({ next: res => this.ignoreCaseLabel = res });

    this.translateService.stream('PAGE.CONCORDANCE.FREQ_OPTIONS.FIRST_LEVEL').subscribe({
      next: res => {
        this.levels = [];
        this.levels.push(new KeyValueItem(FIRST, res));
      }
    });
    this.translateService.stream('PAGE.CONCORDANCE.FREQ_OPTIONS.SECOND_LEVEL').subscribe({ next: res => this.levels.push(new KeyValueItem(SECOND, res)) });
    this.translateService.stream('PAGE.CONCORDANCE.FREQ_OPTIONS.THIRD_LEVEL').subscribe({ next: res => this.levels.push(new KeyValueItem(THIRD, res)) });
    this.translateService.stream('PAGE.CONCORDANCE.FREQ_OPTIONS.FOURTH_LEVEL').subscribe({
      next: res => {
        this.levels.push(new KeyValueItem(FOURTH, res));
        this.selectedLevel = this.levels.filter(l => l.key === this.freqOptionsQueryRequest.level.key)[0];
        const index = this.selectedLevel.key === FIRST ? 0 :
          (this.selectedLevel.key === SECOND ? 1 : (this.selectedLevel.key === THIRD ? 2 : 3));
        this.selectedMultiAttribute[index] = this.freqOptionsQueryRequest.attribute;
        this.selectedPosition[index] = this.freqOptionsQueryRequest.position;
        this.ignoreCase[index] = this.freqOptionsQueryRequest.ignoreCase;
      }
    });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickFreqOption(): void {
    if (this.selectedLevel) {
      this.freqOptionsQueryRequest.level = this.selectedLevel;
    }
    const index = this.freqOptionsQueryRequest.level.key === FIRST ? 0 :
      (this.freqOptionsQueryRequest.level.key === SECOND ? 1 : (this.freqOptionsQueryRequest.level.key === THIRD ? 2 : 3));
    this.freqOptionsQueryRequest.attribute = this.selectedMultiAttribute[index];
    this.freqOptionsQueryRequest.ignoreCase = this.ignoreCase[index];
    this.freqOptionsQueryRequest.position = this.selectedPosition[index];

    localStorage.setItem(FREQ_OPTIONS_QUERY_REQUEST, JSON.stringify(this.freqOptionsQueryRequest));
  }

  public clickNodeTags(): void {
    return;
  }

  public clickNodeForms(): void {
    return;
  }

}
