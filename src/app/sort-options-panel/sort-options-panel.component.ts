import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { L1, L2, L3, LEFT_CONTEXT, NODE, NODE_CONTEXT, R1, R2, R3, RIGHT_CONTEXT, SHUFFLE_CONTEXT, WORD } from '../common/sort-constants';
import { KeyValueItem } from '../model/key-value-item';
import { SortOptionDTO, SortOptionsQueryRequestDTO } from '../model/sort-options-query-request-dto';
import { SortQueryRequest } from '../model/sort-query-request';
import { QueryRequestService } from '../services/query-request.service';

const SORT_OPTIONS_QUERY_REQUEST = 'sortOptionsQueryRequest';

const POSITION_LIST = [
  new KeyValueItem(L3, L3),
  new KeyValueItem(L2, L2),
  new KeyValueItem(L1, L1),
  new KeyValueItem(NODE, NODE),
  new KeyValueItem(R1, R1),
  new KeyValueItem(R2, R2),
  new KeyValueItem(R3, R3),
];

const SELECTED_POSITION = [
  new KeyValueItem(NODE, NODE),
  new KeyValueItem(NODE, NODE),
  new KeyValueItem(NODE, NODE),
];

const SORT_KEYS = [
  new KeyValueItem('LEFT_CONTEXT', 'PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT'),
  new KeyValueItem('NODE_CONTEXT', 'MENU.NODE'),
  new KeyValueItem('RIGHT_CONTEXT', 'PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT')
];

const LEVELS = [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL'),
new KeyValueItem('SECOND_LEVEL', 'SECOND_LEVEL'),
new KeyValueItem('THIRD_LEVEL', 'THIRD_LEVEL')
];

const MULTI_ATTRIBUTE = [
  new KeyValueItem('WORD', 'WORD'),
  new KeyValueItem('WORD', 'WORD'),
  new KeyValueItem('WORD', 'WORD')
];
@Component({
  selector: 'app-sort-options-panel',
  templateUrl: './sort-options-panel.component.html',
  styleUrls: ['./sort-options-panel.component.scss']
})
export class SortOptionsPanelComponent implements OnInit {

  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public concordanceSort = new EventEmitter<SortQueryRequest>();

  public sortOptionsQueryRequest: SortOptionsQueryRequestDTO = SortOptionsQueryRequestDTO.build();

  public attributeList: KeyValueItem[] = [];

  public selectedMultiAttribute = MULTI_ATTRIBUTE;
  public sortKeys = SORT_KEYS;
  public selectedSortKey: KeyValueItem | null = null;
  public levels = LEVELS;
  public selectedLevels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public positionList: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  public selectedPosition: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  public ignoreCase: Array<boolean> = Array.from<boolean>({ length: 0 });
  public backward: Array<boolean> = Array.from<boolean>({ length: 0 });
  public disableMultilevelChechbox: boolean[] = [false, false, false];
  public isSimpleSort = true;

  constructor(
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.positionList = POSITION_LIST;
    this.selectedPosition = SELECTED_POSITION;

    if (this.corpusAttributes && this.corpusAttributes.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false];
    this.backward = [false, false, false];
    const soqr = localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST);
    if (soqr) {
      this.sortOptionsQueryRequest = JSON.parse(soqr);
    }
    this.isSimpleSort = this.queryRequestService.queryRequest.sortQueryRequest === null ? true : !!this.queryRequestService.queryRequest.sortQueryRequest.sortKey;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public makeSort(): void {
    this.isSimpleSort = true;
    this.setSortOption(true);
    this.concordanceSort.emit(this.getSortOption());
  }

  public makeMultilevelSort(): void {
    this.isSimpleSort = false;
    this.setSortOption(false);
    this.concordanceSort.emit(this.getSortOption());
  }

  public deafultValues(): void {
    this.queryRequestService.resetOptionsRequest();
    localStorage.removeItem(SORT_OPTIONS_QUERY_REQUEST);
    this.sortOptionsQueryRequest = SortOptionsQueryRequestDTO.build();
  }

  public clickLeft(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO();
    sortOptionsQueryRequest.sortKey = LEFT_CONTEXT;
    sortOptionsQueryRequest.attribute = WORD;
    sortOptionsQueryRequest.numberTokens = 3;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.concordanceSort.emit(sortQueryRequest);
  }

  public clickRight(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO();
    sortOptionsQueryRequest.sortKey = RIGHT_CONTEXT;
    sortOptionsQueryRequest.attribute = WORD;
    sortOptionsQueryRequest.numberTokens = 3;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.concordanceSort.emit(sortQueryRequest);
  }

  public clickNode(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO();
    sortOptionsQueryRequest.sortKey = NODE_CONTEXT;
    sortOptionsQueryRequest.attribute = WORD;
    sortOptionsQueryRequest.numberTokens = 3;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.concordanceSort.emit(sortQueryRequest);
  }

  public clickShuffle(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO();
    sortOptionsQueryRequest.sortKey = SHUFFLE_CONTEXT;
    sortOptionsQueryRequest.attribute = WORD;
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.concordanceSort.emit(sortQueryRequest);
  }

  public levelCheck(event: any, i: number): void {
    this.sortOptionsQueryRequest.levelSelected = event.checked ? i : i - 1;
    if (event.checked) {
      this.sortOptionsQueryRequest.sortOptionList.forEach((f, index) => f.level = index <= i - 1);
    }
  }

  private sortQueryRequestBuild(sortOptionsQueryRequest: SortOptionsQueryRequestDTO, isSimpleSort: boolean): SortQueryRequest {
    const res = new SortQueryRequest();
    if (isSimpleSort) {
      res.attribute = sortOptionsQueryRequest.attribute;
      res.sortKey = sortOptionsQueryRequest.sortKey;
      res.numberTokens = sortOptionsQueryRequest.numberTokens;
      res.ignoreCase = sortOptionsQueryRequest.ignoreCase;
      res.backward = sortOptionsQueryRequest.backward;
    } else {
      for (let i = 0; i < sortOptionsQueryRequest.levelSelected; i++) {
        const sortOption = new SortOptionDTO();
        sortOption.attribute = sortOptionsQueryRequest.sortOptionList[i].attribute;
        sortOption.ignoreCase = sortOptionsQueryRequest.sortOptionList[i].ignoreCase;
        sortOption.backward = sortOptionsQueryRequest.sortOptionList[i].backward;
        sortOption.position = sortOptionsQueryRequest.sortOptionList[i].position;
        res.multilevelSort.push(sortOption);
      }
    }
    return res;
  }

  private setSortOption(isSimpleSort: boolean): void {
    this.queryRequestService.resetOptionsRequest();
    if (this.sortOptionsQueryRequest) {
      this.queryRequestService.queryRequest.sortQueryRequest = this.sortQueryRequestBuild(this.sortOptionsQueryRequest, isSimpleSort);
      localStorage.setItem(SORT_OPTIONS_QUERY_REQUEST, JSON.stringify(this.sortOptionsQueryRequest));
    }
  }

  private getSortOption(): SortQueryRequest {
    return this.queryRequestService.queryRequest.sortQueryRequest!;
  }

}
