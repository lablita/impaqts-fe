import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  ALL_LEMMANS, COLLOCATIONS, CONCORDANCE, CORPUS_INFO, FILTER, FREQUENCY,
  FREQ_OPTIONS_LABEL, MENU_COLL_OPTIONS, MENU_FILTER, MENU_VISUAL_QUERY, SELECT_CORPUS,
  SORT, SORT_OPTIONS_LABEL, VIEW_OPTIONS, VIEW_OPTIONS_LABEL, WORD_LIST, WORD_OPTIONS_LABEL
} from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { DisplayPanelService } from '../services/display-panel.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-dispaly-panel-options',
  templateUrl: './dispaly-panel-options.component.html',
  styleUrls: ['./dispaly-panel-options.component.scss']
})
export class DispalyPanelOptionsComponent {

  @Input() isVisualQuery = false;
  @Input() selectedCorpus: KeyValueItem | null = null;
  @Input() metadataAttributes: KeyValueItem[] = [];
  @Input() textTypesAttributes: KeyValueItem[] = [];
  @Input() metadataTextTypes: Metadatum[] = [];

  public selectCorpus = SELECT_CORPUS;

  public visualQueryOptionsLabel = '';
  public viewOptionsLabel = '';
  public titleOption?: KeyValueItem;
  public wordListOptionsLabel = '';
  public sortOptionsLabel = '';
  public freqOptionsLabel = '';
  public collocationOptionsLabel = '';
  public filterOptionsLabel = '';

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly translateService: TranslateService,
    public displayPanelService: DisplayPanelService
  ) {
    this.init();
  }

  private init() {
    this.menuEmitterService.menuEvent$.subscribe(
      {
        next: (event: MenuEvent) => {
          if (this.emitterService.pageMenu === CONCORDANCE) {
            switch (event && event.item) {
              case WORD_LIST:
                this.titleOption = new KeyValueItem(WORD_OPTIONS_LABEL, this.wordListOptionsLabel);
                this.emitterService.clickPanelDisplayOptions.emit(true);
                break;
              case SORT:
                this.titleOption = new KeyValueItem(SORT_OPTIONS_LABEL, this.sortOptionsLabel);
                this.emitterService.clickPanelDisplayOptions.emit(true);
                break;
              case FREQUENCY:
                this.titleOption = new KeyValueItem(FREQ_OPTIONS_LABEL, this.freqOptionsLabel);
                this.emitterService.clickPanelDisplayOptions.emit(true);
                break;
              case COLLOCATIONS:
                this.titleOption = new KeyValueItem(MENU_COLL_OPTIONS, this.collocationOptionsLabel);
                this.emitterService.clickPanelDisplayOptions.emit(true);
                break;
              case FILTER:
                this.titleOption = new KeyValueItem(MENU_FILTER, this.filterOptionsLabel);
                this.emitterService.clickPanelDisplayOptions.emit(true);
                break;
              case VIEW_OPTIONS:
                this.titleOption = new KeyValueItem(VIEW_OPTIONS_LABEL, this.viewOptionsLabel);
                this.emitterService.clickPanelDisplayOptions.emit(true);
                break;
              case CORPUS_INFO:
                this.titleOption = new KeyValueItem(CORPUS_INFO, CORPUS_INFO);
                break;
              case ALL_LEMMANS:
                this.titleOption = new KeyValueItem(ALL_LEMMANS, ALL_LEMMANS);
                break;
              default:
                this.titleOption = new KeyValueItem(VIEW_OPTIONS_LABEL, this.viewOptionsLabel);
            }
            this.emitterService.clickLabel.emit(this.titleOption);
          }
        }
      }
    );
    this.emitterService.clickPanelDisplayOptions.subscribe({
      next: (event: boolean) => {
        this.displayPanelService.displayPanelOptions = event;
      }
    });

    this.emitterService.clickPanelDisplayMetadata.subscribe({
      next: (event: boolean) => {
        this.displayPanelService.displayPanelMetadata = event;
      }
    });
    this.translateService.stream(WORD_OPTIONS_LABEL).subscribe({ next: res => this.wordListOptionsLabel = res });
    this.translateService.stream(MENU_VISUAL_QUERY).subscribe({ next: res => this.visualQueryOptionsLabel = res });
    this.translateService.stream(SORT_OPTIONS_LABEL).subscribe({ next: res => this.sortOptionsLabel = res });
    this.translateService.stream(FREQ_OPTIONS_LABEL).subscribe({ next: res => this.freqOptionsLabel = res });
    this.translateService.stream(MENU_COLL_OPTIONS).subscribe({ next: res => this.collocationOptionsLabel = res });
    this.translateService.stream(MENU_FILTER).subscribe({ next: res => this.filterOptionsLabel = res });
    this.translateService.stream(VIEW_OPTIONS_LABEL).subscribe({
      next: res => {
        this.viewOptionsLabel = res
        this.titleOption = new KeyValueItem(VIEW_OPTIONS_LABEL, this.viewOptionsLabel);
      }
    });
  }
}
