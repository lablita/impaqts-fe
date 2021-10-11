import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { CONCORDANCE_WORD, FIRST, L1, L2, L3, NODE, R1, R2, R3, SECOND } from '../model/constants';
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

  @Input() public showRightButton: boolean = false;
  @Input() public corpusAttributes: KeyValueItem[] = new Array<KeyValueItem>();
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public sortOptionsQueryRequest: SortOptionsQueryRequest | null = null;

  public attributeList: KeyValueItem[] = [];

  public selectedMultiAttribute: KeyValueItem[] = new Array<KeyValueItem>();
  public sortKeys: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedSortKey: KeyValueItem | null = null;
  public ignoreCaseLabel: string = '';
  public backwordLabel: string = '';
  public levels: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedLevel: KeyValueItem | null = null;
  public positionList: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedPosition: KeyValueItem[] = new Array<KeyValueItem>();
  public ignoreCase: boolean[] = new Array<boolean>();
  public backward: boolean[] = new Array<boolean>();

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {


    this.translateService.stream(CONCORDANCE_WORD).subscribe(res => {
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

    if (this.corpusAttributes && this.corpusAttributes.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false];
    this.backward = [false, false, false];
    const soqr = localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST);
    const inst = INSTALLATION_LIST.find(i => i.index === environment.installation);
    this.sortOptionsQueryRequest = soqr ?
      JSON.parse(soqr) :
      inst && inst.startup.sortOptionsQueryRequest;

    if (this.sortOptionsQueryRequest) {
      this.selectedSortKey = this.sortKeys.filter(sk => this.sortOptionsQueryRequest && sk.key === this.sortOptionsQueryRequest.sortKey.key)[0];
      this.selectedLevel = this.levels.filter(l => this.sortOptionsQueryRequest && l.key === this.sortOptionsQueryRequest.level.key)[0];
      if (!!this.selectedLevel) {
        const index = this.selectedLevel.key === FIRST ? 0 : (this.selectedLevel.key === SECOND ? 1 : 2);
        this.selectedMultiAttribute[index] = this.sortOptionsQueryRequest.attributeMulti;
        this.selectedPosition[index] = this.sortOptionsQueryRequest.position;
        this.ignoreCase[index] = this.sortOptionsQueryRequest.ignoreCaseMulti;
        this.backward[index] = this.sortOptionsQueryRequest.backwardMulti;
      }
    }
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickSortOption(): void {
    if (this.sortOptionsQueryRequest) {
      if (this.selectedSortKey) {
        this.sortOptionsQueryRequest.sortKey = this.selectedSortKey;
      }
      if (this.selectedLevel) {
        this.sortOptionsQueryRequest.level = this.selectedLevel;
      }
      const index = this.sortOptionsQueryRequest.level.key === FIRST ? 0 : (this.sortOptionsQueryRequest.level.key === SECOND ? 1 : 2);
      this.sortOptionsQueryRequest.attributeMulti = this.selectedMultiAttribute[index];
      this.sortOptionsQueryRequest.ignoreCaseMulti = this.ignoreCase[index];
      this.sortOptionsQueryRequest.backwardMulti = this.backward[index];
      this.sortOptionsQueryRequest.position = this.selectedPosition[index];
      localStorage.setItem(SORT_OPTIONS_QUERY_REQUEST, JSON.stringify(this.sortOptionsQueryRequest));
    }
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
