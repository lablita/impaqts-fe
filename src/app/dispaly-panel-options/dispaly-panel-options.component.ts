import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly translateService: TranslateService,
    public displayPanelService: DisplayPanelService
  ) { }

  private init(): void {
    this.emitterService.panelDisplayOptions.subscribe({
      next: (event: boolean) => {
        this.displayPanelService.displayPanelOptions = event;
        this.titleOption = this.displayPanelService.panelItemSelected;
      }
    });

    this.emitterService.panelDisplayMetadata.subscribe({
      next: (event: boolean) => {
        this.displayPanelService.displayPanelMetadata = event;
      }
    });
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    // this.emitterService.panelDisplayOptions.unsubscribe();
    // this.emitterService.panelDisplayMetadata.unsubscribe();
  }

}
