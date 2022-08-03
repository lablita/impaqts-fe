import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollocationOptionsQueryRequestDTO, DEFAULT_COLLOCATION_OPTIONS_QUERY_REQUEST } from '../model/collocation-options-query-request-dto';
import { CollocationQueryRequest } from '../model/collocation-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequestService } from '../services/query-request.service';

const COLL_OPTIONS_QUERY_REQUEST = 'collocationOptionsQueryRequest';

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

const OPTIOIN_LIST = [
  new KeyValueItem('T_SCORE', 'T_SCORE'),
  new KeyValueItem('MI', 'MI'), new KeyValueItem('MI3', 'MI3'),
  new KeyValueItem('LOG', 'LOG'), new KeyValueItem('MIN', 'MIN'),
  new KeyValueItem('LOG_DICE', 'LOG_DICE'), new KeyValueItem('MI_LOG', 'MI_LOG')
];

const ATTRIBUTE_LIST = [
  new KeyValueItem('WORD', 'WORD'),
  new KeyValueItem('TAG', 'TAG'),
  new KeyValueItem('LEMMA', 'LEMMA')
];

@Component({
  selector: 'app-collocation-options-panel',
  templateUrl: './collocation-options-panel.component.html',
  styleUrls: ['./collocation-options-panel.component.scss']
})
export class CollocationOptionsPanelComponent {

  @Input() public showRightButton = false;
  @Output() public loadCollocations = new EventEmitter<boolean>();
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO;
  public attributeList: KeyValueItem[] = ATTRIBUTE_LIST;
  public optionList: KeyValueItem[] = OPTIOIN_LIST;

  constructor(
    private queryRequestService: QueryRequestService
  ) {
    const collOptReq = localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST);
    this.collocationOptionsQueryRequest = collOptReq ?
      JSON.parse(collOptReq) : DEFAULT_COLLOCATION_OPTIONS_QUERY_REQUEST;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }


  public loadCollocationsOption(): void {
    localStorage.setItem(COLL_OPTIONS_QUERY_REQUEST, JSON.stringify(this.collocationOptionsQueryRequest));
    this.queryRequestService.resetOptionsRequest();
    this.queryRequestService.queryRequest.collocationQueryRequest = this.collocationQueryRequestBuild(this.collocationOptionsQueryRequest);
    this.loadCollocations.emit(true);
    this.closeSidebarEvent.emit(true);
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

}
