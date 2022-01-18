import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { COLLOCATIONS, FILTER, FREQUENCY, SELECT_CORPUS, SORT, VIEW_OPTIONS, WORD_LIST } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { DisplayPanelService } from '../services/display-panel.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-dispaly-panel-options',
  templateUrl: './dispaly-panel-options.component.html',
  styleUrls: ['./dispaly-panel-options.component.scss']
})
export class DispalyPanelOptionsComponent implements OnInit, OnDestroy {

  @Input() isVisualQuery = false;
  @Input() selectedCorpus: KeyValueItem | null = null;
  @Input() metadataAttributes: KeyValueItem[] = [];
  @Input() textTypesAttributes: KeyValueItem[] = [];
  @Input() metadataTextTypes: Metadatum[] = [];

  public selectCorpus = SELECT_CORPUS;

  public VIEW_OPTIONS = VIEW_OPTIONS;
  public WORD_LIST = WORD_LIST;
  public SORT = SORT;
  public FILTER = FILTER;
  public FREQUENCY = FREQUENCY;
  public COLLOCATIONS = COLLOCATIONS;
  public titleOption: string | null = null;

  private menuEmitterServiceSubscription: Subscription | null = null;
  private emitterServiceOptionsSubcription: Subscription | null = null;
  private emitterServiceMetadataSubcription: Subscription | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    public displayPanelService: DisplayPanelService,
    private readonly menuEmitterService: MenuEmitterService
  ) { }

  private init(): void {
    this.titleOption = this.displayPanelService.panelItemSelected;
    if (!this.emitterServiceOptionsSubcription) {
      this.emitterServiceOptionsSubcription = this.emitterService.panelDisplayOptions.subscribe({
        next: (event: boolean) => {
          this.displayPanelService.displayPanelOptions = event;
        }
      });
    }
    if (!this.emitterServiceMetadataSubcription) {
      this.emitterServiceMetadataSubcription = this.emitterService.panelDisplayMetadata.subscribe({
        next: (event: boolean) => {
          this.displayPanelService.displayPanelMetadata = event;
        }
      });
    }
    if (!this.menuEmitterServiceSubscription) {
      this.menuEmitterServiceSubscription = this.menuEmitterService.menuEvent$.subscribe(() => {
        if (this.displayPanelService.displayPanelOptions) {
          this.titleOption = this.displayPanelService.panelItemSelected;
          this.displayPanelService.displayPanelOptions = true;
          this.displayPanelService.displayPanelMetadata = false;
        }
      });
    }
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    if (this.menuEmitterServiceSubscription) {
      this.menuEmitterServiceSubscription.unsubscribe();
    }
    if (this.emitterServiceOptionsSubcription) {
      this.emitterServiceOptionsSubcription.unsubscribe();
    }
    if (this.emitterServiceMetadataSubcription) {
      this.emitterServiceMetadataSubcription.unsubscribe();
    }
  }

}


