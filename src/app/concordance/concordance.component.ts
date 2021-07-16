import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { STRUCT_DOC, TOKEN, WS_URL } from '../common/constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  CHARACTER, COLLOCATIONS, CQL, FILTER, FREQUENCY, INSTALLATION, LEMMA,
  PHRASE, RESULT_CONCORDANCE, SIMPLE, SORT, VIEW_OPTIONS, WORD, WORD_LIST
} from '../model/constants';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/Metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';
import { TextTypesRequest } from '../model/text-types-request';
import { EmitterService } from '../utils/emitter.service';
import { ViewOptionsPanelComponent } from '../view-options-panel/view-options-panel.component';

@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit, AfterViewInit, OnDestroy {
  public subHeader = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  @ViewChild('viewOptionsPanel') private viewOptionsPanel: ViewOptionsPanelComponent;

  public contextConcordanceQueryRequest: ContextConcordanceQueryRequest = new ContextConcordanceQueryRequest();

  public installation: Installation;
  /** public */
  public corpusList: KeyValueItem[] = [];
  public metadataTextTypes: Metadatum[] = [];

  public lemma: string;
  public selectedCorpus: KeyValueItem;
  public queryTypes: KeyValueItem[];
  public selectedQueryType: KeyValueItem;
  public selectCorpus = 'PAGE.CONCORDANCE.SELECT_CORPUS';
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public titleOption: string;
  public simple: string;
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
  public totalResults = 0;
  public kwicLines: KWICline[];
  public TotalKwicline: KWICline[];

  public metadataAttributes: KeyValueItem[];
  public textTypesAttributes: KeyValueItem[];

  public loading: boolean;
  public totalRecords: number;
  public simpleResult: string;


  /** private */
  private websocket: WebSocketSubject<any>;
  private metadataQuery: QueryToken = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService
  ) { }

  ngOnDestroy(): void {
    this.websocket.unsubscribe();
  }

  ngAfterViewInit(): void {
  }
  refresh(): void {
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));

    /** Web Socket */
    const url = `ws://localhost:9000${WS_URL}`;
    this.websocket = webSocket(url);
    this.websocket.asObservable().subscribe(
      resp => {
        const qr = resp as QueryResponse;
        if (qr.kwicLines.length > 0) {
          // this.queryResponse = resp as QueryResponse;
          this.kwicLines = (resp as QueryResponse).kwicLines;
        }
        this.totalResults = qr.currentSize;
        this.simpleResult = this.simple;
        // this.loading = false;
      },
      err => console.error(err),
      () => console.log('Activiti WS disconnected')
    );

    this.queryTypeStatus = false;
    this.contextStatus = false;
    this.textTypeStatus = false;

    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      switch (event.item) {
        case WORD_LIST:
          this.titleOption = this.wordListOptionsLabel;
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        case SORT:
          this.titleOption = this.sortOptionsLabel;
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        case FREQUENCY:
          this.titleOption = this.freqOptionsLabel;
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        case COLLOCATIONS:
          this.titleOption = this.collocationOptionsLabel;
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        case FILTER:
          this.titleOption = this.filterOptionsLabel;
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        case VIEW_OPTIONS:
          this.titleOption = this.viewOptionsLabel;
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        default:
          this.titleOption = this.viewOptionsLabel;
        // this.emitterService.clickPanelDisplayOptions.emit(true);
      }
      this.emitterService.clickLabel.emit(this.titleOption);
    });

    this.emitterService.clickPanelDisplayOptions.subscribe((event: boolean) => {
      this.displayPanelOptions = event;
    });

    this.emitterService.clickPanelDisplayMetadata.subscribe((event: boolean) => {
      this.displayPanelMetadata = event;
    });

    this.translateService.stream('PAGE.CONCORDANCE.SELECT_CORPUS').subscribe(res => this.selectCorpus = res);
    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.WORD_OPTIONS').subscribe(res => this.wordListOptionsLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.SORT_OPTIONS.SORT_OPTIONS').subscribe(res => this.sortOptionsLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.FREQ_OPTIONS.FREQ_OPTIONS').subscribe(res => this.freqOptionsLabel = res);
    this.translateService.stream('MENU.COLLOCATIONS').subscribe(res => this.collocationOptionsLabel = res);
    this.translateService.stream('MENU.FILTER').subscribe(res => this.filterOptionsLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS').subscribe(res => this.titleOption = this.viewOptionsLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.SIMPLE').subscribe(res => {
      this.queryTypes = [];
      this.queryTypes.push(new KeyValueItem(SIMPLE, res));
      this.selectedQueryType = res;
    });
    this.translateService.stream('PAGE.CONCORDANCE.LEMMA').subscribe(res => this.queryTypes.push(new KeyValueItem(LEMMA, res)));
    this.translateService.stream('PAGE.CONCORDANCE.PHRASE').subscribe(res => this.queryTypes.push(new KeyValueItem(PHRASE, res)));
    this.translateService.stream('PAGE.CONCORDANCE.WORD').subscribe(res => this.queryTypes.push(new KeyValueItem(WORD, res)));
    this.translateService.stream('PAGE.CONCORDANCE.CHARACTER').subscribe(res => this.queryTypes.push(new KeyValueItem(CHARACTER, res)));
    this.translateService.stream('PAGE.CONCORDANCE.CQL').subscribe(res => this.queryTypes.push(new KeyValueItem(CQL, res)));
  }

  public clickQueryType(): void {
    this.queryTypeStatus = !this.queryTypeStatus;
  }

  public clickContext(): void {
    this.contextStatus = !this.contextStatus;
  }

  public clickTextType(): void {
    this.textTypeStatus = !this.textTypeStatus;
    this.emitterService.clickLabelMetadataDisabled.emit(!this.textTypeStatus);
  }

  public clickClearAll(): void {

  }

  public dropdownCorpus(): void {
    this.clickTextType();
    this.emitterService.clickLabelOptionsDisabled.emit(!this.selectedCorpus);
    this.emitterService.clickLabelMetadataDisabled.emit(!this.selectedCorpus || !this.textTypeStatus);
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

  public loadConcordances(event?: LazyLoadEvent): void {
    // this.loading = true;
    const qr = new QueryRequest();
    if (!event) {
      qr.start = 0;
      qr.end = 10;
    } else {
      qr.start = event.first;
      qr.end = qr.start + event.rows;
    }
    qr.queryPattern = new QueryPattern();
    qr.queryPattern.tokPattern = new Array<QueryToken>();
    const simpleQueryToken = new QueryToken(TOKEN);
    const simpleQueryTag = new QueryTag(TOKEN);
    simpleQueryTag.name = 'word';
    simpleQueryTag.value = this.simple;
    simpleQueryToken.tags[0][0] = simpleQueryTag;
    qr.queryPattern.tokPattern.push(simpleQueryToken);
    if (this.metadataQuery) {
      qr.queryPattern.structPattern = this.metadataQuery;
    }
    qr.corpus = this.selectedCorpus.key;
    this.websocket.next(qr);
    this.menuEmitterService.click.emit(new MenuEvent(RESULT_CONCORDANCE));
  }

  public setMetadataQuery(textTypesRequest: TextTypesRequest): void {
    //Tutto in OR
    this.metadataQuery = new QueryToken();
    if (textTypesRequest.freeTexts?.length > 0) {
      textTypesRequest.freeTexts.forEach(ft => {
        const tag = new QueryTag(STRUCT_DOC);
        tag.name = ft.key;
        tag.value = ft.value;
        this.metadataQuery.tags.push([tag]);
      });
    }
    if (textTypesRequest.multiSelects?.length > 0) {
      textTypesRequest.multiSelects.forEach(ms => {
        ms.values.forEach(v => {
          const tag = new QueryTag(STRUCT_DOC);
          tag.name = ms.key;
          tag.value = v;
          this.metadataQuery.tags.push([tag]);
        });
      });
    }
    if (textTypesRequest.singleSelects?.length > 0) {
      const tag = new QueryTag(STRUCT_DOC);
      tag.name = textTypesRequest.singleSelects[0].key;
      tag.value = textTypesRequest.singleSelects[0].value;
      this.metadataQuery.tags.push([tag]);
    }
    this.loadConcordances();
  }
}
