import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequestService } from '../services/query-request.service';
import { WORD } from '../common/query-constants';
import { VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import { DEFAULT_VIEW_OPTIONS_QUERY_REQUEST_ATTRIBUTES } from '../common/view-option-constants';



@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})

export class ViewOptionsPanelComponent implements OnInit {

  @Input() public corpus: string | null | undefined = null;
  @Input() public corpusAttributes: Array<KeyValueItem> = [];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();


 public corpusAttributesSelected: Array<KeyValueItem> = [];

  constructor(
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    const voqr = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
    if (voqr) {
      this.corpusAttributesSelected = JSON.parse(voqr);
    }
  }

  public clickChangeViewOption(): void {
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES, JSON.stringify(this.corpusAttributesSelected));
    // const viewOptionQueryRequest = new ViewOptionQueryRequest();
    // viewOptionQueryRequest.attributes = this.corpusAttributesSelected.map(att => att.value);
    // this.queryRequestService.getQueryRequest().viewOptionRequest = viewOptionQueryRequest;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public deafultValues(): void {
    this.queryRequestService.resetOptionsRequest();
    localStorage.removeItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
    this.corpusAttributesSelected = DEFAULT_VIEW_OPTIONS_QUERY_REQUEST_ATTRIBUTES;
    ;
  }
}
