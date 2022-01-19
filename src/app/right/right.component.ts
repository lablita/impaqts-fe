import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import {
  COLLOCATIONS, CONCORDANCE, FILTER, FREQUENCY, FREQ_OPTIONS_LABEL,
  MENU_COLL_OPTIONS, MENU_FILTER, SORT, SORT_OPTIONS_LABEL,
  VIEW_OPTIONS, VIEW_OPTIONS_LABEL, WORD_LIST, WORD_OPTIONS_LABEL
} from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { EmitterService } from '../utils/emitter.service';

const menuToPanelLabel: KeyValueItem[] = [
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
  public titleLabel = '';
  public faCheck = faCheck;
  public hideMetadataLabel = false;
  public hideOptionsLabel = false;
  public spinnerMetadata = false;

  private panelMetaOn: boolean | null = null;
  private panelOptionOn: boolean | null = null;
  private titleOption: string | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly metadataQueryService: MetadataQueryService,
    public displayPanelService: DisplayPanelService,
    private readonly menuEmitterService: MenuEmitterService
  ) { }

  ngOnInit(): void {
    this.panelMetaOn = false;
    this.panelOptionOn = false;
    this.menuEmitterService.menuEvent$.subscribe(() => {
      this.titleOption = this.displayPanelService.panelItemSelected ? this.displayPanelService.panelItemSelected : VIEW_OPTIONS;
      if (this.emitterService.pageMenu === CONCORDANCE
        || menuToPanelLabel.filter(item => item.key === this.emitterService.pageMenu).length > 0) {
        this.hideMetadataLabel = false;
        this.hideOptionsLabel = false;
        this.titleLabel = menuToPanelLabel.filter(item => item.key === this.titleOption)[0].value;

        if (!this.panelOptionOn && this.emitterService.pageMenu !== CONCORDANCE) {
          this.openSidebarOptions();
        }
      } else {
        this.hideMetadataLabel = true;
        this.hideOptionsLabel = true;
      }
    });
    this.emitterService.spinnerMetadata.subscribe({ next: (event: boolean) => this.spinnerMetadata = event });
  }

  public openSidebarOptions(): void {
    this.panelOptionOn = !this.panelOptionOn;
    this.displayPanelService.labelMetadataDisabled = this.panelOptionOn;
    this.displayPanelService.labelOptionsDisabled = !this.panelOptionOn;
    this.displayPanelService.displayPanelOptions = this.panelOptionOn;
    this.displayPanelService.panelItemSelected = this.titleOption;
    this.emitterService.panelDisplayOptions.emit(this.panelOptionOn);
  }

  public openSidebarMetadata(): void {
    this.panelMetaOn = !this.panelMetaOn;
    this.displayPanelService.labelOptionsDisabled = this.panelMetaOn;
    this.displayPanelService.displayPanelMetadata = this.panelMetaOn;
    this.emitterService.panelDisplayMetadata.emit(this.panelMetaOn);
  }

  public checkMetadata(): boolean {
    return this.metadataQueryService.isCompiled();
  }

}
