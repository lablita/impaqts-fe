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

  @Input() public showRightButton: boolean = false;
  @Input() public metadata: Metadatum[] = new Array<Metadatum>();
  @Input() public corpus: string | null | undefined = '';
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public contextConcordanceQueryRequest: ContextConcordanceQueryRequest | null = ContextConcordanceQueryRequest.getInstance();
  public filterOptionsQueryRequest: FilterOptionsQueryRequest = FilterOptionsQueryRequest.getInstance();

  public displayPanelMetadata = false;
  public filters: KeyValueItem[] = [];
  public selectedFilter: KeyValueItem | null = null;
  public tokens: KeyValueItem[] = [];
  public selectedToken: KeyValueItem | null = null;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const inst = INSTALLATION_LIST.find(i => i.index === environment.installation);
    const foqr = localStorage.getItem(FILTER_OPTIONS_QUERY_REQUEST)
    this.filterOptionsQueryRequest = foqr ? JSON.parse(foqr) : inst && inst.startup.filterOptionsQueryRequest;

    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.POSITIVE').subscribe(res => {
      this.filters = [];
      this.filters.push(new KeyValueItem(POSITIVE, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.NEGATIVE').subscribe(res => this.filters.push(new KeyValueItem(NEGATIVE, res)));

    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.FIRST').subscribe(res => {
      this.tokens = [];
      this.tokens.push(new KeyValueItem(FIRST, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.FILTER_OPTIONS.LAST').subscribe(res => this.tokens.push(new KeyValueItem(LAST, res)));
    if (!!this.metadata && this.metadata.length > 0) {
      this.metadata.forEach(m => {
        if ('tree' in m) {
          m.tree = [];
        }
      });
    }
  }

  public clickMakeFilter(): void {
    if (this.contextConcordanceQueryRequest) {
      this.filterOptionsQueryRequest.contextConcordance = this.contextConcordanceQueryRequest;
      localStorage.setItem(FILTER_OPTIONS_QUERY_REQUEST, JSON.stringify(this.filterOptionsQueryRequest));
    }
  }

  public clickOverlaps(): void {

  }

  public clickFirst(): void {

  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

}
