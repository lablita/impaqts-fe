import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequestService } from '../services/query-request.service';
import { VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import { MetadataQueryService } from '../services/metadata-query.service';
import { v4 as uuid } from 'uuid';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';
import { ConcordanceRequest } from '../queries-container/queries-container.component';

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
    private readonly queryRequestService: QueryRequestService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    const voqr = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
    if (voqr) {
      this.corpusAttributesSelected = JSON.parse(voqr);
    } else {
      this.corpusAttributesSelected = this.metadataQueryService.getDefaultMetadataAttributes();
    }
  }

  public clickChangeViewOption(): void {
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES, JSON.stringify(this.corpusAttributesSelected));
    this.makeConcordances();
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public deafultValues(): void {
    this.queryRequestService.resetOptionsRequest();
    this.metadataQueryService.clearViewOptionAttributesInLocalstorage();
    this.corpusAttributesSelected = this.metadataQueryService.getDefaultMetadataAttributes();
  }

  private makeConcordances(): void {
    this.queryRequestService.resetQueryPattern();
    let typeSearch = ['Query'];
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    this.queryRequestService.getQueryRequest().id = uuid();
    if (fieldRequest) {
      fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequest();
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload([new ConcordanceRequest(fieldRequest, typeSearch)], 0));
    }
  }

}
