import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { L1, L2, L3, LEFT_CONTEXT, NODE, NODE_CONTEXT, R1, R2, R3, RIGHT_CONTEXT, SHUFFLE_CONTEXT, WORD } from '../common/sort-constants';
import { KeyValueItem } from '../model/key-value-item';
import { DEFAULT_SORT_OPTIONS_QUERY_REQUEST, SortOptionDTO, SortOptionsQueryRequestDTO } from '../model/sort-options-query-request-dto';
import { SortQueryRequest } from '../model/sort-query-request';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { QueryRequestService } from '../services/query-request.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';

const SORT_OPTIONS_QUERY_REQUEST = 'sortOptionsQueryRequest';

const POSITION_LIST = [
  L3,
  L2,
  L1,
  NODE,
  R1,
  R2,
  R3
];

const SELECTED_POSITION = [
  NODE,
  NODE,
  NODE,
];

const SORT_KEYS = [
  new KeyValueItem('LEFT_CONTEXT', 'PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT'),
  new KeyValueItem('NODE_CONTEXT', 'MENU.NODE'),
  new KeyValueItem('RIGHT_CONTEXT', 'PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT')
];

const LEVELS = [
  'FIRST_LEVEL', 
  'SECOND_LEVEL',
  'THIRD_LEVEL'
] 

const MULTI_ATTRIBUTE = [
  'WORD',
  'WORD',
  'WORD'
]

@Component({
  selector: 'app-sort-options-panel',
  templateUrl: './sort-options-panel.component.html',
  styleUrls: ['./sort-options-panel.component.scss']
})
export class SortOptionsPanelComponent implements OnInit {

  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = [];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public concordanceSort = new EventEmitter<SortQueryRequest>();

  public sortOptionsQueryRequest: SortOptionsQueryRequestDTO = DEFAULT_SORT_OPTIONS_QUERY_REQUEST;

  public attributeList: KeyValueItem[] = [];

  public selectedMultiAttribute = MULTI_ATTRIBUTE;
  public sortKeys = SORT_KEYS;
  public selectedSortKey: KeyValueItem | null = null;
  public levels = LEVELS;
  public selectedLevels: Array<KeyValueItem> = [];
  public positionList: string[] = [];
  public selectedPosition: string[] = [];
  public ignoreCase: Array<boolean> = Array.from<boolean>({ length: 0 });
  public backward: Array<boolean> = Array.from<boolean>({ length: 0 });
  public disableMultilevelChechbox: boolean[] = [false, false, false];
  public isSimpleSort = true;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.positionList = POSITION_LIST;
    this.selectedPosition = SELECTED_POSITION;
    this.sortOptionsQueryRequest.sortOptionList[0].level = true;

    if (this.corpusAttributes && this.corpusAttributes.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }
    this.ignoreCase = [false, false, false];
    this.backward = [false, false, false];
    const soqr = localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST);
    if (soqr) {
      this.sortOptionsQueryRequest = JSON.parse(soqr);
    }
    const queryRequest = this.queryRequestService.getQueryRequest();
    this.isSimpleSort = queryRequest.sortQueryRequest === null ? true : !!queryRequest.sortQueryRequest.sortKey;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public makeSort(): void {
    this.isSimpleSort = true;
    this.setSortOption(true, null);
    this.makeConcordances();
    const sortOption = this.getSortOption();
    if (sortOption) {
      this.concordanceSort.emit(sortOption);
    }
  }

  public makeMultilevelSort(): void {
    this.isSimpleSort = false;
    this.setSortOption(false, null);
    this.makeConcordances();
    const sortOption = this.getSortOption();
    if (sortOption) {
      this.concordanceSort.emit(sortOption);
    }
  }

  public deafultValues(): void {
    this.queryRequestService.resetOptionsRequest();
    localStorage.removeItem(SORT_OPTIONS_QUERY_REQUEST);
    this.sortOptionsQueryRequest = DEFAULT_SORT_OPTIONS_QUERY_REQUEST;
    this.sortOptionsQueryRequest.sortOptionList[0].level = true;
  }

  public clickLeft(): void {
    //const sortOptionList = this.sortOptionsQueryRequest.sortOptionList;
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO(
      WORD,
      LEFT_CONTEXT,
      3,
      false,
      false,
      0,
      [],
      false
    );
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.setSortOption(true, sortQueryRequest);
    this.concordanceSort.emit(sortQueryRequest);
    this.makeConcordances();
  }

  public clickRight(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO(
      WORD,
      RIGHT_CONTEXT,
      3,
      false,
      false,
      0,
      [],
      false
    );
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.setSortOption(true, sortQueryRequest);
    this.concordanceSort.emit(sortQueryRequest);
    this.makeConcordances();
  }

  public clickNode(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO(
      WORD,
      NODE_CONTEXT,
      3,
      false,
      false,
      0,
      [],
      false
    );
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.setSortOption(true, sortQueryRequest);
    this.concordanceSort.emit(sortQueryRequest);
    this.makeConcordances();
  }

  public clickShuffle(): void {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO(
      WORD,
      SHUFFLE_CONTEXT,
      3,
      false,
      false,
      0,
      [],
      false
    );
    const sortQueryRequest = this.sortQueryRequestBuild(sortOptionsQueryRequest, true);
    this.setSortOption(true, sortQueryRequest);
    this.concordanceSort.emit(sortQueryRequest);
    this.makeConcordances();
  }

  public levelCheck(event: any, i: number): void {
    this.sortOptionsQueryRequest.levelSelected = event.checked ? i : i - 1;
    if (event.checked) {
      this.sortOptionsQueryRequest.sortOptionList.forEach((f, index) => f.level = index <= i - 1);
    }
  }

  private sortQueryRequestBuild(sortOptionsQueryRequest: SortOptionsQueryRequestDTO, isSimpleSort: boolean): SortQueryRequest {
    const res = new SortQueryRequest();
    res.attribute = sortOptionsQueryRequest.attribute;
    res.sortKey = sortOptionsQueryRequest.sortKey;
    res.numberTokens = sortOptionsQueryRequest.numberTokens;
    res.ignoreCase = sortOptionsQueryRequest.ignoreCase;
    res.backward = sortOptionsQueryRequest.backward;
    res.multilevel = false;
    for (let i = 0; i < sortOptionsQueryRequest.levelSelected; i++) {
      const sortOption = new SortOptionDTO(
        false,
        sortOptionsQueryRequest.sortOptionList[i].attribute,
        sortOptionsQueryRequest.sortOptionList[i].ignoreCase,
        sortOptionsQueryRequest.sortOptionList[i].backward,
        sortOptionsQueryRequest.sortOptionList[i].position
      );
      res.multilevelSort.push(sortOption);
    }
    res.multilevel = !this.isSimpleSort;
    return res;
  }

  private setSortOption(isSimpleSort: boolean, sortQueryRequest: SortQueryRequest | null): void {
    this.queryRequestService.resetOptionsRequest();
    this.queryRequestService.getQueryRequest().sortQueryRequest = !!sortQueryRequest
      ? sortQueryRequest : this.sortQueryRequestBuild(this.sortOptionsQueryRequest, isSimpleSort);
    localStorage.setItem(SORT_OPTIONS_QUERY_REQUEST, JSON.stringify(this.sortOptionsQueryRequest));
  }

  private getSortOption(): SortQueryRequest | null {
    if (this.queryRequestService.getQueryRequest() && this.queryRequestService.getQueryRequest().sortQueryRequest) {
      return this.queryRequestService.getQueryRequest().sortQueryRequest;
    }
    return null;
  }

  private makeConcordances(): void {
    const sortQueryRequest = this.queryRequestService.getQueryRequest().sortQueryRequest;
    this.queryRequestService.resetQueryPattern();
    let typeSearch = ['Query'];
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    const queryRequest = this.queryRequestService.getQueryRequest();
    if (fieldRequest) {
      fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequest();
      if (sortQueryRequest && !!sortQueryRequest.sortKey) {
        typeSearch = ['Sort', sortQueryRequest.sortKey];
      } else if (queryRequest.sortQueryRequest
        && queryRequest.sortQueryRequest !== undefined) {
        typeSearch = ['Sort', !!queryRequest.sortQueryRequest.sortKey
          ? queryRequest.sortQueryRequest.sortKey : 'MULTILEVEL_CONTEXT'];
      }
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload([new ConcordanceRequest(fieldRequest, typeSearch)], 0));
    }
  }

}
