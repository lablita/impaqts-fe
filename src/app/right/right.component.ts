import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { FREQ_OPTIONS_LABEL, MENU_COLL_OPTIONS, MENU_FILTER, SORT_OPTIONS_LABEL, VIEW_OPTIONS_LABEL, WORD_OPTIONS_LABEL } from '../common/label-constants';
import { COLLOCATIONS, CONCORDANCE, FILTER, FREQUENCY, QUERY, SORT, VIEW_OPTIONS, WORD_LIST } from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';

export const MENU_TO_PANEL_LABEL: KeyValueItem[] = [
  new KeyValueItem(CONCORDANCE, VIEW_OPTIONS_LABEL),
  new KeyValueItem(VIEW_OPTIONS, VIEW_OPTIONS_LABEL),
  new KeyValueItem(WORD_LIST, WORD_OPTIONS_LABEL),
  new KeyValueItem(SORT, SORT_OPTIONS_LABEL),
  new KeyValueItem(FILTER, MENU_FILTER),
  new KeyValueItem(FREQUENCY, FREQ_OPTIONS_LABEL),
  new KeyValueItem(COLLOCATIONS, MENU_COLL_OPTIONS)
];

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {
  public titleLabel: string | undefined;
  public faCheck = faCheck;
  public hideMetadataLabel = false;
  public hideOptionsLabel = false;
  public spinnerMetadata = false;

  constructor(
    public displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly queryRequestService: QueryRequestService,
  ) { }

  ngOnInit(): void {
    this.displayPanelService.menuChangedSubject.subscribe(newMenuString => {
      if (newMenuString) {
        let labelToCheck = newMenuString;
        if (labelToCheck === QUERY) {
          labelToCheck = VIEW_OPTIONS;
        }
        this.titleLabel = MENU_TO_PANEL_LABEL.find(item => {
          const translatedItem = item.key;
          return translatedItem === labelToCheck;
        })?.key;
        if (this.titleLabel) {
          this.hideMetadataLabel = false;
          this.hideOptionsLabel = false;
        } else {
          this.hideMetadataLabel = true;
          this.hideOptionsLabel = true;
        }
        this.displayPanelService.panelSelectedSubject.next(this.titleLabel!);
        this.titleLabel = MENU_TO_PANEL_LABEL.find(item => item.key === this.titleLabel)?.value;
      }
    });

    this.emitterService.spinnerMetadata.subscribe({ next: (event: boolean) => this.spinnerMetadata = event });
  }

  public openSidebarOptions(): void {
    this.displayPanelService.optionsButtonSubject.next();
  }

  public openSidebarMetadata(): void {
    this.displayPanelService.metadataButtonSubject.next();
  }

  public checkMetadata(): boolean {
    return this.metadataQueryService.isCompiled();
  }

  public checkOptions(): boolean {
    return this.queryRequestService.isOptionSet();
  }

  public optionsButtonEnabled(): BehaviorSubject<boolean> {
    return this.displayPanelService.labelOptionsSubject;
  }

  public metadataButtonEnabled(): BehaviorSubject<boolean> {
    return this.displayPanelService.labelMetadataSubject;
  }

}
