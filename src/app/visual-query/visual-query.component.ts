import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { STRUCT_DOC, TOKEN, WS_URL } from '../common/constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  ALL_LEMMANS, COLLOCATIONS, CORPUS_INFO, FILTER, FREQUENCY, FREQ_OPTIONS_LABEL,
  INSTALLATION, MENU_COLL_OPTIONS, MENU_FILTER, MENU_VISUAL_QUERY, SELECT_CORPUS,
  SORT, SORT_OPTIONS_LABEL, VIEW_OPTIONS, VIEW_OPTIONS_LABEL, VISUAL_QUERY, WORD_LIST, WORD_OPTIONS_LABEL
} from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/Metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryToken } from '../model/query-token';
import { EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';
import { ViewOptionsPanelComponent } from '../view-options-panel/view-options-panel.component';

@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss']
})

export class VisualQueryComponent implements OnInit, OnDestroy {

  @ViewChild('viewOptionsPanel') private viewOptionsPanel: ViewOptionsPanelComponent;

  public queryPattern: QueryPattern = new QueryPattern();
  public typeListQuery: KeyValueItem[] = [new KeyValueItem('word', 'word'), new KeyValueItem('lemma', 'lemma'), new KeyValueItem('tag', 'tag'), new KeyValueItem('status', 'status'), new KeyValueItem('lc', 'lc'), new KeyValueItem('lemma_lc', 'lemma_lc')];
  public optionList: KeyValueItem[] = [new KeyValueItem('1', 'repeat'), new KeyValueItem('2', 'sentence start'), new KeyValueItem('3', 'sentence end')];

  public metadataTextTypes: Metadatum[];
  public metadata: QueryToken[] = [];

  public installation: Installation;
  public corpusList: KeyValueItem[] = [];
  public selectedCorpus: KeyValueItem;
  public holdSelectedCorpusStr: string;
  public selectCorpus = SELECT_CORPUS;

  public totalResults = 0;
  public simpleResult: string;
  public kwicLines: KWICline[];
  public TotalKwicline: KWICline[];

  public loading = 0;
  public res: KeyValueItem[] = [];
  public enableAddToken = false;
  public enableAddMetadata = false;
  public enableSpinner = false;

  public visualQueryOptionsLabel: string;
  public viewOptionsLabel: string;

  public titleOption: KeyValueItem;
  public wordListOptionsLabel: string;
  public sortOptionsLabel: string;
  public freqOptionsLabel: string;
  public collocationOptionsLabel: string;
  public filterOptionsLabel: string;
  public displayPanelOptions = false;
  public metadataAttributes: KeyValueItem[];
  public textTypesAttributes: KeyValueItem[];

  private websocketVQ: WebSocketSubject<any>;
  private simple: string;

  constructor(
    private readonly translateService: TranslateService,
    private readonly emitterService: EmitterService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly metadataUtilService: MetadataUtilService
  ) { }

  ngOnDestroy(): void {
    this.websocketVQ.unsubscribe();
  }

  ngOnInit(): void {
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.click.emit(new MenuEvent(VISUAL_QUERY));
    this.init();
  }

  private init(): void {
    this.emitterService.pageMenu = VISUAL_QUERY;
    this.translateService.stream(VIEW_OPTIONS_LABEL).
      subscribe(res => this.emitterService.clickLabel.emit(new KeyValueItem(VIEW_OPTIONS_LABEL, res)));
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
    /** Web Socket */
    const url = `ws://localhost:9000${WS_URL}`;
    this.websocketVQ = webSocket(url);
    this.websocketVQ.asObservable().subscribe(
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

    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      if (this.emitterService.pageMenu === VISUAL_QUERY) {
        switch (event?.item) {
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
    });


    this.emitterService.clickPanelDisplayOptions.subscribe((event: boolean) => {
      this.displayPanelOptions = event;
    });

    this.translateService.stream(SELECT_CORPUS).subscribe(res => this.selectCorpus = res);
    this.translateService.stream(WORD_OPTIONS_LABEL).subscribe(res => this.wordListOptionsLabel = res);
    this.translateService.stream(MENU_VISUAL_QUERY).subscribe(res => this.visualQueryOptionsLabel = res);
    this.translateService.stream(SORT_OPTIONS_LABEL).subscribe(res => this.sortOptionsLabel = res);
    this.translateService.stream(FREQ_OPTIONS_LABEL).subscribe(res => this.freqOptionsLabel = res);
    this.translateService.stream(MENU_COLL_OPTIONS).subscribe(res => this.collocationOptionsLabel = res);
    this.translateService.stream(MENU_FILTER).subscribe(res => this.filterOptionsLabel = res);
    this.translateService.stream(VIEW_OPTIONS_LABEL).subscribe(res => this.titleOption = this.viewOptionsLabel = res);
  }

  public addTokenQuery(): void {
    const token = new QueryToken(TOKEN);
    this.queryPattern.tokPattern.push(token);
  }

  public deleteTokenQuery(token: QueryToken): void {
    this.queryPattern.tokPattern.splice(this.queryPattern.tokPattern.indexOf(token), 1);
  }

  public addTokenMetadata(): void {
    const token = new QueryToken(STRUCT_DOC);
    this.metadata.push(token);
    this.enableAddMetadata = false;
  }

  public deleteTokenMetadata(token: QueryToken): void {
    this.metadata.splice(this.queryPattern.tokPattern.indexOf(token), 1);
    this.enableAddMetadata = true;
  }

  public loadConcordances(event?: LazyLoadEvent): void {
    this.queryPattern.structPattern = this.metadata[0];
    const qr = new QueryRequest();
    qr.queryPattern = this.queryPattern;
    if (!event) {
      qr.start = 0;
      qr.end = 10;
    } else {
      qr.start = event.first;
      qr.end = qr.start + event.rows;
    }
    qr.corpus = this.selectedCorpus.key;
    this.websocketVQ.next(qr);
  }

  public dropdownCorpus(): void {
    this.emitterService.clickLabelOptionsDisabled.emit(!this.selectedCorpus);
    if (this.selectedCorpus) {
      this.menuEmitterService.corpusSelected = true;
      this.enableSpinner = true;
      this.enableAddToken = true;
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
      if (this.selectedCorpus.key !== this.holdSelectedCorpusStr) {
        this.metadataUtilService.createMatadataTree(this.selectedCorpus.key, _.cloneDeep(this.installation), true).subscribe(res => {
          this.metadataTextTypes = res['md'];
          this.enableAddMetadata = res['ended'];
          if (this.enableAddMetadata) {
            //ordinamento position 
            this.metadataTextTypes.sort((a, b) => a.position - b.position);
            this.enableSpinner = false;
          }
        });
        this.holdSelectedCorpusStr = this.selectedCorpus.key;
      } else {
        this.enableSpinner = false;
        this.enableAddMetadata = true;
      }
    } else {
      this.enableAddToken = false;
      this.enableAddMetadata = false;
      this.enableSpinner = false;
      this.menuEmitterService.corpusSelected = false;
      this.kwicLines = null;
      this.metadata = [];
      this.queryPattern.tokPattern = [];
    }
    this.menuEmitterService.click.emit(new MenuEvent(VISUAL_QUERY));
  }

  public getMetadatumTextTypes(): Metadatum[] {
    return this.metadataTextTypes;
  }

  public queryTokenOK(): boolean {
    let result = false;
    this.queryPattern.tokPattern.forEach(pt => pt.tags.forEach(tg => tg.forEach(t => {
      if (t?.name?.length) {
        result = true;
      }
    })));
    return result;
  }

}
