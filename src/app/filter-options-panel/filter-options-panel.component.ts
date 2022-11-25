import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FIRST, LAST, NEGATIVE, POSITIVE } from '../common/filter-constants';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { DEFAULT_FILTER_OPTIONS_QUERY_REQUEST, FilterOptionsQueryRequestDTO } from '../model/filter-options-query-request-dto';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';

const FILTER_OPTIONS_QUERY_REQUEST = 'FilterOptionsQueryRequestDTO';
@Component({
  selector: 'app-filter-options-panel',
  templateUrl: './filter-options-panel.component.html',
  styleUrls: ['./filter-options-panel.component.scss']
})
export class FilterOptionsPanelComponent implements OnInit {

  @Input() public metadata: Array<Metadatum> = [];
  @Input() public corpus: string | null | undefined = '';
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequest | null = new ContextConcordanceQueryRequest();
  public filterOptionsQueryRequestDTO: FilterOptionsQueryRequestDTO = FilterOptionsQueryRequestDTO.getInstance();

  public displayPanelMetadata = false;
  public filters: Array<string> = [];
  public selectedFilter: string | null = null;
  public tokens: Array<string> = [];
  public selectedToken: string | null = null;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const foqr = localStorage.getItem(FILTER_OPTIONS_QUERY_REQUEST)
    this.filters = [POSITIVE, NEGATIVE];
    this.tokens = [FIRST, LAST]
    this.filterOptionsQueryRequestDTO = foqr ? JSON.parse(foqr) : DEFAULT_FILTER_OPTIONS_QUERY_REQUEST;

    if (!!this.metadata && this.metadata.length > 0) {
      this.metadata.forEach(m => {
        if ('tree' in m) {
          m.tree = [];
        }
      });
    }
  }

  public clickMakeFilter(): void {
    if (this.contextConcordanceQueryRequestDTO) {
      this.filterOptionsQueryRequestDTO.contextConcordance = this.contextConcordanceQueryRequestDTO;
      localStorage.setItem(FILTER_OPTIONS_QUERY_REQUEST, JSON.stringify(this.filterOptionsQueryRequestDTO));
    }
  }

  public clickOverlaps(): void {
    return;
  }

  public clickFirst(): void {
    return;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

}
