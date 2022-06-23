import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  COLLOCATIONS, CONCORDANCE, FILTER, FREQUENCY, SORT, VIEW_OPTIONS, WORD_LIST
} from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { SortQueryRequest } from '../model/sort-query-request';
import { DisplayPanelService } from '../services/display-panel.service';

@Component({
  selector: 'app-dispaly-panel-options',
  templateUrl: './dispaly-panel-options.component.html',
  styleUrls: ['./dispaly-panel-options.component.scss']
})
export class DispalyPanelOptionsComponent implements OnInit {

  @Input() isVisualQuery = false;
  @Input() selectedCorpus: KeyValueItem | null = null;
  @Input() metadataAttributes: KeyValueItem[] = [];
  @Input() textTypesAttributes: KeyValueItem[] = [];
  @Input() metadataTextTypes: Metadatum[] = [];
  @Output() public loadCollocations = new EventEmitter<boolean>();
  @Output() public quickSort = new EventEmitter<SortQueryRequest>();

  public VIEW_OPTIONS = VIEW_OPTIONS;
  public WORD_LIST = WORD_LIST;
  public SORT = SORT;
  public FILTER = FILTER;
  public FREQUENCY = FREQUENCY;
  public COLLOCATIONS = COLLOCATIONS;
  public titleOption: string | null = null;

  constructor(
    public displayPanelService: DisplayPanelService
  ) { }

  private init(): void {
    this.displayPanelService.panelItemSelected = this.displayPanelService.panelItemSelected === CONCORDANCE
      ? VIEW_OPTIONS : this.displayPanelService.panelItemSelected;
  }

  ngOnInit(): void {
    this.init();
  }

  public loadColl(): void {
    this.loadCollocations.emit(true);
  }

  public quickSortCallback(sortQueryRequest: SortQueryRequest): void {
    this.quickSort.emit(sortQueryRequest);
  }
}


