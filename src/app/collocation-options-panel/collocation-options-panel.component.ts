import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { REQUEST_TYPE } from '../common/query-constants';
import { CollocationOptionsQueryRequestDTO, DEFAULT_COLLOCATION_OPTIONS_QUERY_REQUEST } from '../model/collocation-options-query-request-dto';
import { CollocationQueryRequest } from '../model/collocation-query-request';
import { KeyValueItemExtended } from '../model/key-value-item';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';
import { COLL_OPTIONS_QUERY_REQUEST } from '../common/constants';

const STAT_DESC: { [key: string]: string } = {
  T_SCORE: 't',
  MI: 'm',
  MI3: '3',
  LOG: 'l',
  MIN: 's',
  MI_LOG: 'p',
  REL_FREQ: 'r',
  ABS_FREQ: 'f',
  LOG_DICE: 'd',
};

const OPTION_LIST = [
  'T_SCORE',
  'MI',
  'MI3',
  'LOG',
  'MIN',
  'LOG_DICE',
  'MI_LOG'
];

const OPTION_SORT_LIST = [
  new KeyValueItemExtended('T_SCORE', 'T_SCORE', true),
  new KeyValueItemExtended('MI', 'MI', true),
  new KeyValueItemExtended('MI3', 'MI3', true), 
  new KeyValueItemExtended('LOG', 'LOG', true),
  new KeyValueItemExtended('MIN', 'MIN' , true),
  new KeyValueItemExtended('LOG_DICE', 'LOG_DICE', true),
  new KeyValueItemExtended('MI_LOG', 'MI_LOG', true)
];

const ATTRIBUTE_LIST = [
  'WORD', 
  'TAG', 
  'LEMMA'
]

@Component({
  selector: 'app-collocation-options-panel',
  templateUrl: './collocation-options-panel.component.html',
  styleUrls: ['./collocation-options-panel.component.scss']
})
export class CollocationOptionsPanelComponent {

  @Output() public loadCollocations = new EventEmitter<boolean>();
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO;
  public attributeList: string[] = ATTRIBUTE_LIST;
  public optionList: string[] = OPTION_LIST;
  public optionSortList: KeyValueItemExtended[] = OPTION_SORT_LIST;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    private readonly emitterService: EmitterService,
    //private readonly cd: ChangeDetectorRef
  ) {
    const collOptReq = localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST);

    this.collocationOptionsQueryRequest = collOptReq ?
      JSON.parse(collOptReq) : DEFAULT_COLLOCATION_OPTIONS_QUERY_REQUEST;
      this.changeSortListEnabled();
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }


  public retrieveCollocations(): void {
    localStorage.setItem(COLL_OPTIONS_QUERY_REQUEST, JSON.stringify(this.collocationOptionsQueryRequest));
    this.queryRequestService.resetOptionsRequest();
    this.queryRequestService.resetQueryPattern();
    this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.COLLOCATION_REQUEST;
    this.queryRequestService.getQueryRequest().collocationQueryRequest =
      this.collocationQueryRequestBuild(this.collocationOptionsQueryRequest);
    const basicFieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (basicFieldRequest) {
      this.emitterService.makeCollocation.next(basicFieldRequest);
      this.loadCollocations.emit(true);
    }
    this.closeSidebarEvent.emit(true);
  }

  public changeSortListEnabled(): void {
    let sortList: KeyValueItemExtended[] = [];
    this.inactiveAllOptionSortList();
    this.collocationOptionsQueryRequest.showFunc?.forEach(c => {
      const optSort = this.optionSortList.find(o => o.key === c);
      if (optSort) {
        optSort.inactive = false
      } 
    });
    sortList = this.optionSortList.slice();
    this.optionSortList = sortList;
  }

  private collocationQueryRequestBuild(collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO): CollocationQueryRequest {
    const res = new CollocationQueryRequest();
    res.attribute = !!collocationOptionsQueryRequest.attribute ? collocationOptionsQueryRequest.attribute : null;
    res.minFreqCorpus = collocationOptionsQueryRequest.minFreqCorpus;
    res.minFreqRange = collocationOptionsQueryRequest.minFreqRange;
    res.rangeFrom = collocationOptionsQueryRequest.rangeFrom;
    res.rangeTo = collocationOptionsQueryRequest.rangeTo;
    if (!!collocationOptionsQueryRequest.showFunc) {
      collocationOptionsQueryRequest.showFunc.forEach(item => res.showFunc?.push(STAT_DESC[item]));
    }
    res.sortBy = !!collocationOptionsQueryRequest.sortBy ? STAT_DESC[collocationOptionsQueryRequest.sortBy] : null;
    return res;
  }

  private inactiveAllOptionSortList(): void {
    this.optionSortList.forEach(o => o.inactive = true);
    this.collocationOptionsQueryRequest.sortBy = null;
  }

}
