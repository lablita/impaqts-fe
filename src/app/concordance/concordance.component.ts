import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { INSTALLATION } from '../app.component';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  ALL, ANY, BOTH, CHARACTER, COLLOCATIONS, CQL, FILTER, FREQUENCY, LEFT, LEMMA,
  NONE, PHRASE, RESULT_CONCORDANCE, RIGHT, SIMPLE, SORT, WORD, WORD_LIST
} from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/Metadatum';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { EmitterService } from '../utils/emitter.service';
import { ViewOptionsPanelComponent } from '../view-options-panel/view-options-panel.component';

const WS_URL = '/test-query-ws-ext';

@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit {
  public subHeader = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  @ViewChild('viewOptionsPanel') private viewOptionsPanel: ViewOptionsPanelComponent;

  public installation: Installation;
  /** public */
  public corpusList: KeyValueItem[] = [];
  // public metadataCorpus: Metadatum[] = [];
  public metadataTextTypes: Metadatum[] = [];

  public selectedCorpus: KeyValueItem;
  public windows: KeyValueItem[];
  public selectedWindow: KeyValueItem;
  public items: KeyValueItem[];
  public selectedItem: KeyValueItem;
  public tokens: KeyValueItem[] = [];
  public selectedToken: KeyValueItem;
  public queryTypes: KeyValueItem[];
  public selectedQueryType: KeyValueItem;
  public selectCorpus: string = 'PAGE.CONCORDANCE.SELECT_CORPUS';
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public titleOption: string;
  public simple: string;
  public lemma: string;
  public phrase: string;
  public word: string;
  public character: string;
  public cql: string;
  public queryTypeStatus: boolean;
  public contextStatus: boolean;
  public textTypeStatus: boolean;
  public attributesSelection: string[] = [];
  public viewOptionsLabel: string;
  public wordListOptionsLabel: string;
  public sortOptionsLabel: string;
  public freqOptionsLabel: string;
  public collocationOptionsLabel: string;
  public filterOptionsLabel: string;
  public displayPanelMetadata = false;
  public displayPanelOptions = false;
  public queryResponse: QueryResponse;
  public totalResults = 0;
  public kwicLines: KWICline[];

  public metadataAttributes: KeyValueItem[];
  public textTypesAttributes: KeyValueItem[];

  /** private */
  private websocket: WebSocketSubject<any>;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterServices: EmitterService
  ) { }

  ngOnInit(): void {

    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));

    /** Web Socket */
    const url = `ws://localhost:9000${WS_URL}`;
    this.websocket = webSocket(url);
    this.websocket.asObservable().subscribe(
      resp => {
        const qr = resp as QueryResponse;
        if (qr.kwicLines.length > 0) {
          this.queryResponse = resp as QueryResponse;
        }
        this.totalResults = qr.currentSize;
      },
      err => console.error(err),
      () => console.log('Activiti WS disconnected')
    );

    this.queryTypeStatus = false;
    this.contextStatus = false;
    this.textTypeStatus = false;

    for (let i = 1; i < 6; i++) {
      this.tokens.push(new KeyValueItem('' + i, '' + i));
    }
    this.tokens.push(new KeyValueItem('7', '7'));
    this.tokens.push(new KeyValueItem('10', '10'));
    this.tokens.push(new KeyValueItem('15', '15'));
    this.selectedToken = this.tokens[4];

    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      switch (event.item) {
        case WORD_LIST:
          this.titleOption = this.wordListOptionsLabel;
          break;
        case SORT:
          this.titleOption = this.sortOptionsLabel;
          break;
        case FREQUENCY:
          this.titleOption = this.freqOptionsLabel;
          break;
        case COLLOCATIONS:
          this.titleOption = this.collocationOptionsLabel;
          break;
        case FILTER:
          this.titleOption = this.filterOptionsLabel;
          break;
        default:
          this.titleOption = this.viewOptionsLabel;
      }
      this.emitterServices.clickLabel.emit(this.titleOption);
    });

    this.emitterServices.clickPanelDisplayOptions.subscribe((event: boolean) => {
      this.displayPanelOptions = event;
    });

    this.emitterServices.clickPanelDisplayMetadata.subscribe((event: boolean) => {
      this.displayPanelMetadata = event;
    });

    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {

      this.selectCorpus = this.translateService.instant('PAGE.CONCORDANCE.SELECT_CORPUS');
      this.wordListOptionsLabel = this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.WORD_OPTIONS');
      this.sortOptionsLabel = this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.SORT_OPTIONS');
      this.freqOptionsLabel = this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.FREQ_OPTIONS');
      this.collocationOptionsLabel = this.translateService.instant('MENU.COLLOCATIONS');
      this.filterOptionsLabel = this.translateService.instant('MENU.FILTER');
      this.titleOption = this.viewOptionsLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS');
      this.queryTypes = [
        new KeyValueItem(SIMPLE, simple),
        new KeyValueItem(LEMMA, this.translateService.instant('PAGE.CONCORDANCE.LEMMA')),
        new KeyValueItem(PHRASE, this.translateService.instant('PAGE.CONCORDANCE.PHRASE')),
        new KeyValueItem(WORD, this.translateService.instant('PAGE.CONCORDANCE.WORD')),
        new KeyValueItem(CHARACTER, this.translateService.instant('PAGE.CONCORDANCE.CHARACTER')),
        new KeyValueItem(CQL, this.translateService.instant('PAGE.CONCORDANCE.CQL'))
      ];
      this.selectedQueryType = this.queryTypes[0];

      this.windows = [
        new KeyValueItem(LEFT, this.translateService.instant('PAGE.CONCORDANCE.LEFT')),
        new KeyValueItem(RIGHT, this.translateService.instant('PAGE.CONCORDANCE.RIGHT')),
        new KeyValueItem(BOTH, this.translateService.instant('PAGE.CONCORDANCE.BOTH'))
      ];
      this.selectedWindow = this.windows[2];

      this.items = [
        new KeyValueItem(ALL, this.translateService.instant('PAGE.CONCORDANCE.ALL')),
        new KeyValueItem(ANY, this.translateService.instant('PAGE.CONCORDANCE.ANY')),
        new KeyValueItem(NONE, this.translateService.instant('PAGE.CONCORDANCE.NONE'))
      ];
      this.selectedItem = this.items[0];
    });
  }

  public clickQueryType(): void {
    this.queryTypeStatus = !this.queryTypeStatus;
  }

  public clickContext(): void {
    this.contextStatus = !this.contextStatus;
  }

  public clickTextType(): void {
    this.textTypeStatus = !this.textTypeStatus;
    this.emitterServices.clickLabelMetadataDisabled.emit(!this.textTypeStatus);
  }

  public clickMakeConcordance(): void {
    const qr = new QueryRequest();
    qr.start = 0;
    qr.end = 500000;
    qr.word = `[word="${this.simple}"]`;
    qr.corpus = this.selectedCorpus.key;
    this.websocket.next(qr);
    this.menuEmitterService.click.emit(new MenuEvent(RESULT_CONCORDANCE));
  }

  public clickClearAll(): void {

  }

  public dropdownCorpus(): void {
    this.emitterServices.clickLabelOptionsDisabled.emit(!this.selectedCorpus);
    this.emitterServices.clickLabelMetadataDisabled.emit(!this.selectedCorpus || !this.textTypeStatus);
    if (this.selectedCorpus) {
      this.metadataAttributes = [];
      this.textTypesAttributes = [];
      this.installation.corpora.filter(corpus => corpus.name === this.selectedCorpus.key)[0].
        metadata.sort((a, b) => a.position - b.position);
      this.installation.corpora.filter(corpus => corpus.name === this.selectedCorpus.key)[0]
        .metadata.filter(md => !md.child).forEach(md => {
          //Attributes in View Options
          if (!md.documentMetadatum) {
            this.metadataAttributes.push(new KeyValueItem(md.name, md.name));
          } else {
            this.textTypesAttributes.push(new KeyValueItem(md.name, md.name));
          }
        });
      this.metadataTextTypes = this.installation.corpora.filter(corpus => corpus.name === this.selectedCorpus.key)[0].
        metadata.filter(md => md.documentMetadatum);
    }
  }
}
