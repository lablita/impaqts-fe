import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FIRST, FOURTH, L1, L2, L3, L4, L5, L6, NODE, R1, R2, R3, R4, R5, R6, SECOND, THIRD } from '../model/constants';
import { FreqOptionsQueryRequest } from '../model/freq-options-query_request';
import { KeyValueItem } from '../model/key-value-item';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const FREQ_OPTIONS_QUERY_REQUEST = 'freqOptionsQueryRequest';

@Component({
  selector: 'app-frequency-options-panel',
  templateUrl: './frequency-options-panel.component.html',
  styleUrls: ['./frequency-options-panel.component.scss']
})
export class FrequencyOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Input() public corpusAttributes: KeyValueItem[];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public freqOptionsQueryRequest: FreqOptionsQueryRequest;

  public attributeList: KeyValueItem[] = [];
  public levels: KeyValueItem[];
  public selectedLevel: KeyValueItem;
  public selectedAttribute: KeyValueItem;
  public selectedMultiAttribute: KeyValueItem[];
  public ignoreCase: boolean[];
  public positionList: KeyValueItem[];
  public selectedPosition: KeyValueItem[];
  public ignoreCaseLabel: string;
  public includeCatLabel: string;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.corpusAttributes?.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false, false];

    this.freqOptionsQueryRequest = localStorage.getItem(FREQ_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(FREQ_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].freqOptionsQueryRequest;

    this.translateService.get('PAGE.CONCORDANCE.WORD').subscribe(word => {
      this.includeCatLabel = this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.INCLUDE_CAT');
      this.ignoreCaseLabel = this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.IGNORE_CASE');
      this.levels = [
        new KeyValueItem(FIRST, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.FIRST_LEVEL')),
        new KeyValueItem(SECOND, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.SECOND_LEVEL')),
        new KeyValueItem(THIRD, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.THIRD_LEVEL')),
        new KeyValueItem(FOURTH, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.FOURTH_LEVEL'))
      ];

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

      this.selectedMultiAttribute = [
        new KeyValueItem('word', word),
        new KeyValueItem('word', word),
        new KeyValueItem('word', word),
        new KeyValueItem('word', word)
      ];

      this.selectedPosition = [
        new KeyValueItem(NODE, NODE),
        new KeyValueItem(NODE, NODE),
        new KeyValueItem(NODE, NODE),
        new KeyValueItem(NODE, NODE)
      ];

      this.selectedLevel = this.levels.filter(l => l.key === this.freqOptionsQueryRequest.level.key)[0];
      const index = this.selectedLevel.key === FIRST ? 0 :
        (this.selectedLevel.key === SECOND ? 1 : (this.selectedLevel.key === THIRD ? 2 : 3));
      this.selectedMultiAttribute[index] = this.freqOptionsQueryRequest.attribute;
      this.selectedPosition[index] = this.freqOptionsQueryRequest.position;
      this.ignoreCase[index] = this.freqOptionsQueryRequest.ignoreCase;
    });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickFreqOption(): void {
    this.freqOptionsQueryRequest.level = this.selectedLevel;
    const index = this.freqOptionsQueryRequest.level.key === FIRST ? 0 :
      (this.freqOptionsQueryRequest.level.key === SECOND ? 1 : (this.freqOptionsQueryRequest.level.key === THIRD ? 2 : 3));
    this.freqOptionsQueryRequest.attribute = this.selectedMultiAttribute[index];
    this.freqOptionsQueryRequest.ignoreCase = this.ignoreCase[index];
    this.freqOptionsQueryRequest.position = this.selectedPosition[index];

    localStorage.setItem(FREQ_OPTIONS_QUERY_REQUEST, JSON.stringify(this.freqOptionsQueryRequest));
    console.log('ok');
  }

  public clickNodeTags(): void {

  }

  public clickNodeForms(): void {

  }

}
