import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  COLLOCATIONS, FILTER, FREQUENCY, SORT, VIEW_OPTIONS, WORD_LIST
} from '../common/routes-constants';
import { FrequencyQueryRequest } from '../model/frequency-query-request';
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
  @Output() public loadCollocations = new EventEmitter<boolean>();
  @Output() public sort = new EventEmitter<SortQueryRequest>();
  @Output() public frequency = new EventEmitter<FrequencyQueryRequest>();

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

  public loadColl(): void {
    this.loadCollocations.emit(true);
  }

  public sortCallback(sortQueryRequest: SortQueryRequest): void {
    this.sort.emit(sortQueryRequest);
  }

  public frequencyCallback(frequencyQueryRequest: FrequencyQueryRequest): void {
    this.frequency.emit(frequencyQueryRequest);
  }

  public displayOptionsPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.optionsPanelSubject;
  }

  public displayMetadataPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.metadataPanelSubject;
  }

  public closeMetadataPanel(): void {
    this.displayPanelService.metadataButtonSubject.next();
  }

}


