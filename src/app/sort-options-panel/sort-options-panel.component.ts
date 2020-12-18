import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FIRST, L1, L2, L3, LEFT, NODE, R1, R2, R3, RIGHT, SECOND, THIRD } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { SortOptionsQueryRequest } from '../model/sort-options-query-request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const SORT_OPTIONS_QUERY_REQUEST = 'sortOptionsQueryRequest';

@Component({
  selector: 'app-sort-options-panel',
  templateUrl: './sort-options-panel.component.html',
  styleUrls: ['./sort-options-panel.component.scss']
})
export class SortOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Input() public corpusAttributes: KeyValueItem[];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public sortOptionsQueryRequest: SortOptionsQueryRequest;

  public attributeList: KeyValueItem[] = [];
  // public selectedAttribute: KeyValueItem;
  public selectedMultiAttribute: KeyValueItem[];
  public sortKeys: KeyValueItem[];
  // public selectedSortKey: KeyValueItem;
  public ignoreCaseLabel: string;
  public backwordLabel: string;
  public levels: KeyValueItem[];
  // public selectedLevel: KeyValueItem;
  public positionList: KeyValueItem[];
  public selectedPosition: KeyValueItem[];
  public ignoreCase: boolean[];
  public backward: boolean[];

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.corpusAttributes?.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false];
    this.backward = [false, false, false];

    this.sortOptionsQueryRequest = localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].sortOptionsQueryRequest;

    this.translateService.get('PAGE.CONCORDANCE.WORD').subscribe(word => {
      this.ignoreCaseLabel = this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.IGNORE_CASE');
      this.backwordLabel = this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.BACKWARD');

      this.sortKeys = [
        new KeyValueItem(LEFT, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT')),
        new KeyValueItem(NODE, this.translateService.instant('MENU.NODE')),
        new KeyValueItem(RIGHT, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT'))
      ];

      this.levels = [
        new KeyValueItem(FIRST, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.FIRST_LEVEL')),
        new KeyValueItem(SECOND, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.SECOND_LEVEL')),
        new KeyValueItem(THIRD, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.THIRD_LEVEL'))
      ];

      this.positionList = [
        new KeyValueItem(L3, L3),
        new KeyValueItem(L2, L2),
        new KeyValueItem(L1, L1),
        new KeyValueItem(NODE, NODE),
        new KeyValueItem(R3, R3),
        new KeyValueItem(R2, R2),
        new KeyValueItem(R1, R1)
      ];

      this.selectedMultiAttribute = [
        new KeyValueItem('word', word),
        new KeyValueItem('word', word),
        new KeyValueItem('word', word)
      ];

      this.selectedPosition = [
        new KeyValueItem(NODE, NODE),
        new KeyValueItem(NODE, NODE),
        new KeyValueItem(NODE, NODE),
      ];
    });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickSortOption(): void {
    const index = this.sortOptionsQueryRequest.level.key === FIRST ? 0 : (this.sortOptionsQueryRequest.level.key === SECOND ? 1 : 2);
    this.sortOptionsQueryRequest.attributeMulti = this.selectedMultiAttribute[index];
    this.sortOptionsQueryRequest.ignoreCaseMulti = this.ignoreCase[index];
    this.sortOptionsQueryRequest.backwardMulti = this.backward[index];
    this.sortOptionsQueryRequest.position = this.selectedPosition[index];

    localStorage.setItem(SORT_OPTIONS_QUERY_REQUEST, JSON.stringify(this.sortOptionsQueryRequest));
    console.log('ok');
  }

}
