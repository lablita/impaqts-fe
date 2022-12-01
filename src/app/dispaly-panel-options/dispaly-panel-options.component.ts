import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {COLLOCATION, FILTER, FREQUENCY, SORT, VIEW_OPTION, WORD_LIST} from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { SortQueryRequest } from '../model/sort-query-request';
import { DisplayPanelService } from '../services/display-panel.service';

@Component({
  selector: 'app-dispaly-panel-options',
  templateUrl: './dispaly-panel-options.component.html',
  styleUrls: ['./dispaly-panel-options.component.scss']
})
export class DispalyPanelOptionsComponent {

  @Input() isVisualQuery = false;
  @Input() selectedCorpus: string | null = null;
  @Input() metadataAttributes: KeyValueItem[] = [];
  @Input() textTypesAttributes: KeyValueItem[] = [];
  @Input() metadataTextTypes: Metadatum[] = [];
  @Input() panelDisplayMTD: boolean = false;
  @Input() panelDisplayOPT: boolean = false;
  @Output() public loadCollocations = new EventEmitter<boolean>();
  @Output() public sort = new EventEmitter<SortQueryRequest>();
  @Output() public frequency = new EventEmitter<void>();

  public VIEW_OPTION = VIEW_OPTION;
  public WORD_LIST = WORD_LIST;
  public SORT = SORT;
  public FILTER = FILTER;
  public FREQUENCY = FREQUENCY;
  public COLLOCATION = COLLOCATION;
  public titleOption: string | null = null;
  
  constructor(
    public displayPanelService: DisplayPanelService
  ) {
  }

  public loadColl(): void {
    this.loadCollocations.emit(true);
  }

  public sortConcordances(sortQueryRequest: SortQueryRequest): void {
    this.sort.emit(sortQueryRequest);
  }

  public loadFrequencies(): void {
    this.frequency.emit();
  }

  public displayOptionsPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.optionsPanelSubject;
  }

  public displayMetadataPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.metadataPanelSubject;
  }

  public closeMetadataPanel(): void {
    this.displayPanelService.labelMTDClickSubject.next();
  }

}


