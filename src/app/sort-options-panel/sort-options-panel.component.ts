import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { L1, L2, L3, NODE, R1, R2, R3 } from '../common/sort-constants';
import { KeyValueItem } from '../model/key-value-item';
import { DEFAULT_SORT_OPTION_QUERY_REQUEST, SortOptionsQueryRequest } from '../model/sort-options-query-request';
import { SortOption, SortQueryRequest } from '../model/sort-query-request';
import { QueryRequestService } from '../services/query-request.service';

const SORT_OPTIONS_QUERY_REQUEST = 'sortOptionsQueryRequest';

@Component({
  selector: 'app-sort-options-panel',
  templateUrl: './sort-options-panel.component.html',
  styleUrls: ['./sort-options-panel.component.scss']
})
export class SortOptionsPanelComponent implements OnInit {

  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public quickSort = new EventEmitter<SortQueryRequest>();

  public sortOptionsQueryRequest: SortOptionsQueryRequest | null = null;

  public attributeList: KeyValueItem[] = [];

  public selectedMultiAttribute: KeyValueItem[] = [new KeyValueItem('WORD', 'WORD'), new KeyValueItem('WORD', 'WORD'), new KeyValueItem('WORD', 'WORD')];
  public sortKeys: KeyValueItem[] = [new KeyValueItem('LEFT_CONTEXT', 'PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT'),
  new KeyValueItem('NODE', 'MENU.NODE'),
  new KeyValueItem('RIGHT_CONTEXT', 'PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT')];
  public selectedSortKey: KeyValueItem | null = null;
  public levels: KeyValueItem[] = [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL'),
  new KeyValueItem('SECOND_LEVEL', 'SECOND_LEVEL'),
  new KeyValueItem('THIRD_LEVEL', 'THIRD_LEVEL')];
  public selectedLevels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public positionList: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  public selectedPosition: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  public ignoreCase: Array<boolean> = Array.from<boolean>({ length: 0 });
  public backward: Array<boolean> = Array.from<boolean>({ length: 0 });
  public disableMultilevelChechbox: boolean[] = [false, false, false];
  public enableSimpleSort = true;
  public enableMultilevelSort = true;

  constructor(
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.positionList = [
      new KeyValueItem(L3, L3),
      new KeyValueItem(L2, L2),
      new KeyValueItem(L1, L1),
      new KeyValueItem(NODE, NODE),
      new KeyValueItem(R1, R1),
      new KeyValueItem(R2, R2),
      new KeyValueItem(R3, R3),
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
    this.sortOptionsQueryRequest = soqr ?
      JSON.parse(soqr) :
      DEFAULT_SORT_OPTION_QUERY_REQUEST;

    if (this.sortOptionsQueryRequest) {
      this.selectedSortKey = this.sortKeys.filter(sk => this.sortOptionsQueryRequest &&
        sk.key === this.sortOptionsQueryRequest.sortKey.key)[0];
      this.selectedLevels = this.sortOptionsQueryRequest.levels;
      if (this.selectedLevels.length > 0) {
        this.selectedMultiAttribute = this.sortOptionsQueryRequest.attributeMulti;
        this.selectedPosition = this.sortOptionsQueryRequest.position;
        this.ignoreCase = this.sortOptionsQueryRequest.ignoreCaseMulti;
        this.backward = this.sortOptionsQueryRequest.backwardMulti;
      }
    }
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public setSimpleSortOption(): void {
    this.enableMultilevelSort = false;
    this.setSortOption(true);
  }

  public setMultilevelSortOption(): void {
    this.enableSimpleSort = false;
    this.setSortOption(false);
  }

  public removeSortOption(): void {
    this.enableSimpleSort = this.enableMultilevelSort = true;
    this.queryRequestService.resetOptionsRequest();
  }

  public clickLeft(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequest();
    sortOptionsQueryRequest.sortKey = new KeyValueItem('LEFT_CONTEXT', 'LEFT_CONTEXT');
    sortOptionsQueryRequest.attribute = new KeyValueItem('word', 'word');
    sortOptionsQueryRequest.numberTokens = 3;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.quickSort.emit(sortQueryRequest);
  }

  public clickRight(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequest();
    sortOptionsQueryRequest.sortKey = new KeyValueItem('RIGHT_CONTEXT', 'RIGHT_CONTEXT');
    sortOptionsQueryRequest.attribute = new KeyValueItem('word', 'word');
    sortOptionsQueryRequest.numberTokens = 3;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.quickSort.emit(sortQueryRequest);
  }

  public clickNode(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequest();
    sortOptionsQueryRequest.sortKey = new KeyValueItem('NODE_CONTEXT', 'NODE_CONTEXT');
    sortOptionsQueryRequest.attribute = new KeyValueItem('word', 'word');
    sortOptionsQueryRequest.numberTokens = 3;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.quickSort.emit(sortQueryRequest);
  }

  public clickShuffle(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequest();
    sortOptionsQueryRequest.sortKey = new KeyValueItem('SHUFFLE_CONTEXT', 'SHUFFLE_CONTEXT');
    sortOptionsQueryRequest.attribute = new KeyValueItem('word', 'word');
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.quickSort.emit(sortQueryRequest);
  }

  public multilevelCheckBoxManager(index: number): void {
    if (index === 0) {
      this.disableMultilevelChechbox = [false, false, false];
    } else if (index === 1) {
      if (this.selectedLevels.filter(l => l.key === 'SECOND_LEVEL').length > 0) {
        this.selectedLevels = [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL'), new KeyValueItem('SECOND_LEVEL', 'SECOND_LEVEL')];
        this.disableMultilevelChechbox = [true, false, false];
      } else {
        this.disableMultilevelChechbox = [false, false, false];
      }
    } else { //index === 2 
      if (this.selectedLevels.filter(l => l.key === 'THIRD_LEVEL').length > 0) {
        this.selectedLevels = [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL'), new KeyValueItem('SECOND_LEVEL', 'SECOND_LEVEL'), new KeyValueItem('THIRD_LEVEL', 'THIRD_LEVEL')];
        this.disableMultilevelChechbox = [true, true, false];
      } else {
        this.disableMultilevelChechbox = [true, false, false];
      }
    }
  }

  private sortQueryRequestBuild(sortOptionsQueryRequest: SortOptionsQueryRequest, isSimpleSort: boolean): SortQueryRequest {
    const res = new SortQueryRequest();
    if (isSimpleSort) {
      res.attribute = sortOptionsQueryRequest.attribute.key;
      res.sortKey = sortOptionsQueryRequest.sortKey.key;
      res.numberTokens = sortOptionsQueryRequest.numberTokens;
      res.ignoreCase = sortOptionsQueryRequest.ignoreCase;
      res.backward = sortOptionsQueryRequest.backward;
    } else {
      sortOptionsQueryRequest.levels.forEach((opt, index) => {
        const sortOption = new SortOption();
        sortOption.attribute = sortOptionsQueryRequest.attributeMulti[index].value;
        sortOption.ignoreCase = sortOptionsQueryRequest.ignoreCaseMulti[index];
        sortOption.backward = sortOptionsQueryRequest.backwardMulti[index];
        sortOption.position = sortOptionsQueryRequest.position[index].value;
        res.multilevelSort.push(sortOption);
      });
    }
    return res;
  }

  private setSortOption(isSimpleSort: boolean): void {
    if (this.sortOptionsQueryRequest) {
      if (this.selectedSortKey) {
        this.sortOptionsQueryRequest.sortKey = this.selectedSortKey;
      }
      if (this.selectedLevels.length > 0) {
        this.sortOptionsQueryRequest.levels = this.selectedLevels;
      }
      this.sortOptionsQueryRequest.attributeMulti = this.selectedMultiAttribute.slice(0, this.selectedLevels.length);
      this.sortOptionsQueryRequest.ignoreCaseMulti = this.ignoreCase;
      this.sortOptionsQueryRequest.backwardMulti = this.backward;
      this.sortOptionsQueryRequest.position = this.selectedPosition.slice(0, this.selectedLevels.length);
      localStorage.setItem(SORT_OPTIONS_QUERY_REQUEST, JSON.stringify(this.sortOptionsQueryRequest));
    }
    if (this.sortOptionsQueryRequest) {
      this.queryRequestService.resetOptionsRequest();
      this.queryRequestService.queryRequest.sortQueryRequest = this.sortQueryRequestBuild(this.sortOptionsQueryRequest, isSimpleSort);
    }
  }



}
