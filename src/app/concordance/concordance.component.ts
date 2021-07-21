import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { STRUCT_DOC, TOKEN, WS_URL } from '../common/constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  ALL_LEMMANS, CHARACTER, COLLOCATIONS, CONCORDANCE, CONCORDANCE_CHARACTER,
  CONCORDANCE_CQL, CONCORDANCE_LEMMA, CONCORDANCE_PHRASE,
  CONCORDANCE_SIMPLE, CONCORDANCE_WORD, CORPUS_INFO, CQL,
  FILTER, FREQUENCY, FREQ_OPTIONS_LABEL, INSTALLATION, LEMMA,
  MENU_COLL_OPTIONS, MENU_FILTER, MENU_VISUAL_QUERY, PHRASE,
  RESULT_CONCORDANCE, SELECT_CORPUS, SIMPLE, SORT, SORT_OPTIONS_LABEL,
  VIEW_OPTIONS, VIEW_OPTIONS_LABEL, VISUAL_QUERY, WORD, WORD_LIST, WORD_OPTIONS_LABEL
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
import { MetadataUtilService } from '../utils/metadata-util.service';
import { ViewOptionsPanelComponent } from '../view-options-panel/view-options-panel.component';

@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit, OnDestroy {
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
  public selectCorpus = SELECT_CORPUS;
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public titleOption: KeyValueItem;
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
  public visualQueryOptionsLabel: string;
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

  public endedMetadataProcess: false;

  /** private */
  private websocket: WebSocketSubject<any>;
  private metadataQuery: QueryToken = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly metadataUtilService: MetadataUtilService
  ) { }

  ngOnDestroy(): void {
    this.websocket.unsubscribe();
  }

  ngOnInit(): void {
    this.translateService.stream(VIEW_OPTIONS_LABEL).
      subscribe(res => this.emitterService.clickLabel.emit(new KeyValueItem(VIEW_OPTIONS_LABEL, res)));
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
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
          this.kwicLines = (resp as QueryResponse).kwicLines;
        }
        this.totalResults = qr.currentSize;
        this.simpleResult = this.simple;
      },
      err => console.error(err),
      () => console.log('Activiti WS disconnected')
    );

    this.queryTypeStatus = false;
    this.contextStatus = false;
    this.textTypeStatus = false;

    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      switch (event?.item) {
        case WORD_LIST:
          this.titleOption = new KeyValueItem(WORD_OPTIONS_LABEL, this.wordListOptionsLabel);
          this.emitterService.clickPanelDisplayOptions.emit(true);
          break;
        case VISUAL_QUERY:
          this.titleOption = new KeyValueItem(MENU_VISUAL_QUERY, this.visualQueryOptionsLabel);
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
    });

    this.emitterService.clickPanelDisplayOptions.subscribe((event: boolean) => {
      this.displayPanelOptions = event;
    });

    this.emitterService.clickPanelDisplayMetadata.subscribe((event: boolean) => {
      this.displayPanelMetadata = event;
    });

    this.translateService.stream(SELECT_CORPUS).subscribe(res => this.selectCorpus = res);
    this.translateService.stream(WORD_OPTIONS_LABEL).subscribe(res => this.wordListOptionsLabel = res);
    this.translateService.stream(MENU_VISUAL_QUERY).subscribe(res => this.visualQueryOptionsLabel = res);
    this.translateService.stream(SORT_OPTIONS_LABEL).subscribe(res => this.sortOptionsLabel = res);
    this.translateService.stream(FREQ_OPTIONS_LABEL).subscribe(res => this.freqOptionsLabel = res);
    this.translateService.stream(MENU_COLL_OPTIONS).subscribe(res => this.collocationOptionsLabel = res);
    this.translateService.stream(MENU_FILTER).subscribe(res => this.filterOptionsLabel = res);
    this.translateService.stream(VIEW_OPTIONS_LABEL).subscribe(res => this.titleOption = this.viewOptionsLabel = res);
    this.translateService.stream(CONCORDANCE_SIMPLE).subscribe(res => {
      this.queryTypes = [];
      this.queryTypes.push(new KeyValueItem(SIMPLE, res));
      this.selectedQueryType = res;
    });
    this.translateService.stream(CONCORDANCE_LEMMA).subscribe(res => this.queryTypes.push(new KeyValueItem(LEMMA, res)));
    this.translateService.stream(CONCORDANCE_PHRASE).subscribe(res => this.queryTypes.push(new KeyValueItem(PHRASE, res)));
    this.translateService.stream(CONCORDANCE_WORD).subscribe(res => this.queryTypes.push(new KeyValueItem(WORD, res)));
    this.translateService.stream(CONCORDANCE_CHARACTER).subscribe(res => this.queryTypes.push(new KeyValueItem(CHARACTER, res)));
    this.translateService.stream(CONCORDANCE_CQL).subscribe(res => this.queryTypes.push(new KeyValueItem(CQL, res)));
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

  public clickClearAll(): void { }

  public dropdownCorpus(): void {
    this.clickTextType();
    this.emitterService.clickLabelOptionsDisabled.emit(!this.selectedCorpus);
    this.emitterService.clickLabelMetadataDisabled.emit(true);
    if (this.selectedCorpus) {
      this.menuEmitterService.corpusSelected = true;
      this.emitterService.spinnerMetadata.emit(true);
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
      this.metadataUtilService.createMatadataTree(this.selectedCorpus.key, this.installation, false).subscribe(res => {
        this.metadataTextTypes = res['md'];
        this.endedMetadataProcess = res['ended'];
        if (this.endedMetadataProcess) {
          this.emitterService.clickLabelMetadataDisabled.emit(!this.selectedCorpus || !this.textTypeStatus);
          //ordinamento position 
          this.metadataTextTypes.sort((a, b) => a.position - b.position);
          this.emitterService.spinnerMetadata.emit(false);
        }
      });
    } else {
      this.menuEmitterService.corpusSelected = false;
    }
    this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
  }

  public loadConcordances(event?: LazyLoadEvent): void {
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
