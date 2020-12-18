import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FIRST, LAST, NEGATIVE, POSITIVE } from '../model/constants';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { FilterOptionsQueryRequest } from '../model/filter-options-query.request';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const FILTER_OPTIONS_QUERY_REQUEST = 'filterOptionsQueryRequest';
@Component({
  selector: 'app-filter-options-panel',
  templateUrl: './filter-options-panel.component.html',
  styleUrls: ['./filter-options-panel.component.scss']
})
export class FilterOptionsPanelComponent implements OnInit {

  @Input() public metadata: Metadatum[];
  @Input() public corpus: string;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public contextConcordanceQueryRequest: ContextConcordanceQueryRequest = new ContextConcordanceQueryRequest();
  public filterOptionsQueryRequest: FilterOptionsQueryRequest;

  public displayPanelMetadata = false;
  public filters: KeyValueItem[] = [];
  public selectedFilter: KeyValueItem;
  public tokens: KeyValueItem[] = [];
  public selectedToken: KeyValueItem;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.filterOptionsQueryRequest = localStorage.getItem(FILTER_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(FILTER_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].filterOptionsQueryRequest;

    this.translateService.get('PAGE.CONCORDANCE.FILTER_OPTIONS.POSITIVE').subscribe(positive => {

      this.filters = [
        new KeyValueItem(POSITIVE, positive),
        new KeyValueItem(NEGATIVE, this.translateService.instant('PAGE.CONCORDANCE.FILTER_OPTIONS.NEGATIVE')),
      ];

      this.tokens = [
        new KeyValueItem(FIRST, this.translateService.instant('PAGE.CONCORDANCE.FILTER_OPTIONS.FIRST')),
        new KeyValueItem(LAST, this.translateService.instant('PAGE.CONCORDANCE.FILTER_OPTIONS.LAST')),
      ];
    });
  }

  public clickMakeFilter(): void {
    this.filterOptionsQueryRequest.contextConcordance = this.contextConcordanceQueryRequest;
    localStorage.setItem(FILTER_OPTIONS_QUERY_REQUEST, JSON.stringify(this.filterOptionsQueryRequest));
    console.log('ok');
  }

}
