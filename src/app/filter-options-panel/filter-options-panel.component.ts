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

  @Input() public showRightButton = false;
  @Input() public metadata: Array<Metadatum> = Array.from<Metadatum>({ length: 0 });
  @Input() public corpus: string | null | undefined = '';
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequest | null = new ContextConcordanceQueryRequest();
  public filterOptionsQueryRequestDTO: FilterOptionsQueryRequestDTO = FilterOptionsQueryRequestDTO.getInstance();

  public displayPanelMetadata = false;
  public filters: Array<KeyValueItem> = [];
  public selectedFilter: KeyValueItem | null = null;
  public tokens: Array<KeyValueItem> = [];
  public selectedToken: KeyValueItem | null = null;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const foqr = localStorage.getItem(FILTER_OPTIONS_QUERY_REQUEST)
    this.filterOptionsQueryRequestDTO = foqr ? JSON.parse(foqr) : DEFAULT_FILTER_OPTIONS_QUERY_REQUEST;

    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.POSITIVE').subscribe({
      next: res => {
        this.filters = [];
        this.filters.push(new KeyValueItem(POSITIVE, res));
      }
    });
    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.NEGATIVE').subscribe({ next: res => this.filters.push(new KeyValueItem(NEGATIVE, res)) });

    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.FIRST').subscribe({
      next: res => {
        this.tokens = [];
        this.tokens.push(new KeyValueItem(FIRST, res));
      }
    });
    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.LAST').subscribe({ next: res => this.tokens.push(new KeyValueItem(LAST, res)) });
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
