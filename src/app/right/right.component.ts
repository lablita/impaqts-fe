import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { FREQ_OPTIONS_LABEL, MENU_COLL_OPTIONS, MENU_FILTER, SORT_OPTIONS_LABEL, VIEW_OPTIONS_LABEL, WORD_OPTIONS_LABEL } from '../common/label-constants';
import { COLLOCATIONS, CONCORDANCE, FILTER, FREQUENCY, QUERY, SORT, VIEW_OPTIONS, WORD_LIST } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { KeyValueItem } from '../model/key-value-item';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { EmitterService } from '../utils/emitter.service';

const MENU_TO_PANEL_LABEL: KeyValueItem[] = [
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

  private titleOption: string | null = null;

  constructor(
    public displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.displayPanelService.menuChangedSubject.subscribe(newMenuString => {
      if (newMenuString) {
        let labelToCheck = newMenuString;
        if (labelToCheck === QUERY) {
          labelToCheck = this.translateService.instant(VIEW_OPTIONS_LABEL);
        }
        this.titleLabel = MENU_TO_PANEL_LABEL.find(item => {
          const translatedItem = this.translateService.instant(item.value);
          return translatedItem === labelToCheck;
        })?.value;
        if (this.titleLabel === VIEW_OPTIONS_LABEL) {
          this.hideMetadataLabel = false;
          this.hideOptionsLabel = false;
        } else {
          this.hideMetadataLabel = true;
          this.hideOptionsLabel = true;
        }
      }
    });


    this.menuEmitterService.menuEvent$.subscribe(() => {
      this.titleOption = (this.displayPanelService.panelItemSelected && this.displayPanelService.panelItemSelected !== CONCORDANCE)
        ? this.displayPanelService.panelItemSelected : VIEW_OPTIONS;

    });
    this.emitterService.spinnerMetadata.subscribe({ next: (event: boolean) => this.spinnerMetadata = event });
  }

  public openSidebarOptions(): void {
    this.displayPanelService.displayPanelOptions = !this.displayPanelService.displayPanelOptions;
    // this.displayPanelService.displayPanelMetadata = false;
    this.displayPanelService.panelItemSelected = this.titleOption;
    // this.displayPanelService.panelDisplaySubject.next(this.displayPanelService.displayPanelOptions || this.displayPanelService.displayPanelMetadata);
  }

  public openSidebarMetadata(): void {
    // this.displayPanelService.displayPanelMetadata = !this.displayPanelService.displayPanelMetadata;
    // this.displayPanelService.displayPanelOptions = false;
    //this.displayPanelService.panelDisplaySubject.next(this.displayPanelService.displayPanelOptions || this.displayPanelService.displayPanelMetadata);
    this.displayPanelService.metadataButtonSubject.next();
  }

  public checkMetadata(): boolean {
    return this.metadataQueryService.isCompiled();
  }

  public optionsButtonEnabled(): BehaviorSubject<boolean> {
    return this.displayPanelService.labelOptionsSubject;
  }

}
