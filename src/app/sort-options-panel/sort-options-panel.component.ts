import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FIRST, L1, L2, L3, NODE, R1, R2, R3, SECOND } from '../model/constants';
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

  public selectedMultiAttribute: KeyValueItem[];
  public sortKeys: KeyValueItem[];
  public selectedSortKey: KeyValueItem;
  public ignoreCaseLabel: string;
  public backwordLabel: string;
  public levels: KeyValueItem[];
  public selectedLevel: KeyValueItem;
  public positionList: KeyValueItem[];
  public selectedPosition: KeyValueItem[];
  public ignoreCase: boolean[];
  public backward: boolean[];

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {


    this.translateService.stream('PAGE.CONCORDANCE.WORD').subscribe(res => {
      this.selectedMultiAttribute = [
        new KeyValueItem('word', res),
        new KeyValueItem('word', res),
        new KeyValueItem('word', res)
      ];
    });

    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.IGNORE_CASE').subscribe(res => this.ignoreCaseLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.BACKWARD').subscribe(res => this.backwordLabel = res);

    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT').subscribe(res => {
      this.sortKeys = [];
      this.sortKeys.push(new KeyValueItem('PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT', res));
    });
    this.translateService.stream('MENU.NODE').subscribe(res => this.sortKeys.push(new KeyValueItem('MENU.NODE', res)));
    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT').subscribe(res => this.sortKeys.push(new KeyValueItem('PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT', res)));

    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.FIRST_LEVEL').subscribe(res => {
      this.levels = [];
      this.levels.push(new KeyValueItem('PAGE.CONCORDANCE.SORT_OPTIONS.FIRST_LEVEL', res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.SECOND_LEVEL').subscribe(res => this.levels.push(new KeyValueItem('PAGE.CONCORDANCE.SORT_OPTIONS.SECOND_LEVEL', res)));
    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.THIRD_LEVEL').subscribe(res => this.levels.push(new KeyValueItem('PAGE.CONCORDANCE.SORT_OPTIONS.THIRD_LEVEL', res)));

    this.positionList = [
      new KeyValueItem(L3, L3),
      new KeyValueItem(L2, L2),
      new KeyValueItem(L1, L1),
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(R3, R3),
      new KeyValueItem(R2, R2),
      new KeyValueItem(R1, R1)
    ];

    this.selectedPosition = [
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(NODE, NODE),
    ];

    if (this.corpusAttributes?.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false];
    this.backward = [false, false, false];

    this.sortOptionsQueryRequest = localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].sortOptionsQueryRequest;

    this.selectedSortKey = this.sortKeys.filter(sk => sk.key === this.sortOptionsQueryRequest.sortKey.key)[0];
    this.selectedLevel = this.levels.filter(l => l.key === this.sortOptionsQueryRequest.level.key)[0];
    if (!!this.selectedLevel) {
      const index = this.selectedLevel.key === FIRST ? 0 : (this.selectedLevel.key === SECOND ? 1 : 2);
      this.selectedMultiAttribute[index] = this.sortOptionsQueryRequest.attributeMulti;
      this.selectedPosition[index] = this.sortOptionsQueryRequest.position;
      this.ignoreCase[index] = this.sortOptionsQueryRequest.ignoreCaseMulti;
      this.backward[index] = this.sortOptionsQueryRequest.backwardMulti;
    }
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickSortOption(): void {
    this.sortOptionsQueryRequest.sortKey = this.selectedSortKey;
    this.sortOptionsQueryRequest.level = this.selectedLevel;
    const index = this.sortOptionsQueryRequest.level.key === FIRST ? 0 : (this.sortOptionsQueryRequest.level.key === SECOND ? 1 : 2);
    this.sortOptionsQueryRequest.attributeMulti = this.selectedMultiAttribute[index];
    this.sortOptionsQueryRequest.ignoreCaseMulti = this.ignoreCase[index];
    this.sortOptionsQueryRequest.backwardMulti = this.backward[index];
    this.sortOptionsQueryRequest.position = this.selectedPosition[index];

    localStorage.setItem(SORT_OPTIONS_QUERY_REQUEST, JSON.stringify(this.sortOptionsQueryRequest));
    console.log('ok');
  }

  public clickLeft(): void {

  }

  public clickRight(): void {

  }

  public clickNode(): void {

  }

  public clickShuffle(): void {

  }

}
