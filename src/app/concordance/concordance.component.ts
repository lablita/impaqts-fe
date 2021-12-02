import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, map, tap } from 'rxjs/operators';
import { STRUCT_DOC, TOKEN } from '../common/constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  ALL_LEMMANS, CHARACTER, COLLOCATIONS, CONCORDANCE, CONCORDANCE_CHARACTER,
  CONCORDANCE_CQL, CONCORDANCE_LEMMA, CONCORDANCE_PHRASE,
  CONCORDANCE_SIMPLE, CONCORDANCE_WORD, CORPUS_INFO, CQL,
  FILTER, FREQUENCY, FREQ_OPTIONS_LABEL, INSTALLATION, LEMMA,
  MENU_COLL_OPTIONS, MENU_FILTER, MENU_VISUAL_QUERY, PHRASE,
  RESULT_CONCORDANCE, SELECT_CORPUS, SIMPLE, SORT, SORT_OPTIONS_LABEL,
  VIEW_OPTIONS, VIEW_OPTIONS_LABEL, WORD, WORD_LIST, WORD_OPTIONS_LABEL
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
import { SocketService } from '../services/socket.service';
import { EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';

@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit {

  public contextConcordanceQueryRequest: ContextConcordanceQueryRequest = ContextConcordanceQueryRequest.getInstance();

  public installation?: Installation;
  /** public */
  public corpusList: KeyValueItem[] = [];
  public metadataTextTypes: Metadatum[] = [];

  public lemma: string | null = null;
  public selectedCorpus: KeyValueItem | null = null;
  public queryTypes: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedQueryType: KeyValueItem | null = null;
  public selectCorpus = SELECT_CORPUS;
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public titleOption: KeyValueItem | null = null;
  public simple: string = '';
  public phrase: string = '';
  public word: string = '';
  public character: string = '';
  public cql: string = '';
  public queryTypeStatus: boolean = false;
  public contextStatus: boolean = false;
  public textTypeStatus: boolean = false;
  public attributesSelection: string[] = [];
  public viewOptionsLabel: string = '';
  public wordListOptionsLabel: string = '';
  public visualQueryOptionsLabel: string = '';
  public sortOptionsLabel: string = '';
  public freqOptionsLabel: string = '';
  public collocationOptionsLabel: string = '';
  public filterOptionsLabel: string = '';
  public displayPanelMetadata = false;
  public displayPanelOptions = false;
  public totalResults = 0;
  public kwicLines: KWICline[] = new Array<KWICline>();
  public totalKwicline: KWICline[] = new Array<KWICline>();

  public metadataAttributes: KeyValueItem[] = new Array<KeyValueItem>();
  public textTypesAttributes: KeyValueItem[] = new Array<KeyValueItem>();

  public loading = false;
  public totalRecords = 0;
  public simpleResult = '';

  public endedMetadataProcess = false;
  public holdSelectedCorpusStr = '';

  public resultView = false;
  public noResultFound = false;
  public displayModal = false;

  public videoUrl: SafeResourceUrl | null = null;

  /** private */
  private metadataQuery: QueryToken | null = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly socketService: SocketService,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.emitterService.pageMenu = CONCORDANCE;
    this.translateService.stream(VIEW_OPTIONS_LABEL).
      subscribe(res => this.emitterService.clickLabel.emit(new KeyValueItem(VIEW_OPTIONS_LABEL, res)));
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
    this.init();
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
    this.resultView = false;
    this.noResultFound = false;
    this.clickTextType();
    this.emitterService.clickLabelOptionsDisabled.emit(!this.selectedCorpus);
    this.emitterService.clickLabelMetadataDisabled.emit(true);
    if (this.selectedCorpus) {
      this.menuEmitterService.corpusSelected = true;
      this.emitterService.spinnerMetadata.emit(true);
      this.metadataAttributes = [];
      this.textTypesAttributes = [];
      if (this.installation && this.installation.corpora) {
        const selectedCorpusKey = this.selectedCorpus.key;
        if (selectedCorpusKey) {
          this.installation.corpora.filter(corpus => corpus.name === selectedCorpusKey)[0].
            metadata.sort((a, b) => a.position - b.position);
          this.installation.corpora.filter(corpus => corpus.name === selectedCorpusKey)[0]
            .metadata.filter(md => !md.child).forEach(md => {
              //Attributes in View Options
              if (!md.documentMetadatum) {
                this.metadataAttributes.push(new KeyValueItem(md.name, md.name));
              } else {
                this.textTypesAttributes.push(new KeyValueItem(md.name, md.name));
              }
            });
        }
      }
      if (this.selectedCorpus.key !== this.holdSelectedCorpusStr) {
        if (this.installation) {
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
        }
        this.holdSelectedCorpusStr = this.selectedCorpus.key;
      } else {
        this.emitterService.clickLabelMetadataDisabled.emit(!this.selectedCorpus || !this.textTypeStatus);
        this.emitterService.spinnerMetadata.emit(false);
        this.endedMetadataProcess = true;
      }
    } else {
      this.menuEmitterService.corpusSelected = false;
      this.simple = '';
      this.kwicLines = new Array<KWICline>();
      this.contextStatus = false;
      this.queryTypeStatus = false;
    }
    this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
  }

  public makeConcordances(): void {
    this.loading = true;
    this.resultView = false;
    this.loadConcordances();
  }

  public loadConcordances(event?: LazyLoadEvent): void {
    if (!!this.selectedCorpus) {
      const qr = new QueryRequest();
      if (!event) {
        qr.start = 0;
        qr.end = 10;
      } else {
        if (event.first !== undefined && event.first !== null && event.rows !== undefined && event.rows !== null) {
          qr.start = event.first;
          qr.end = qr.start + event.rows;
        }
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
      this.socketService.sendMessage(qr);
      this.menuEmitterService.click.emit(new MenuEvent(RESULT_CONCORDANCE));
    }
  }

  public setMetadataQuery(textTypesRequest: TextTypesRequest): void {
    //Tutto in OR
    this.metadataQuery = new QueryToken();
    if (textTypesRequest.freeTexts && textTypesRequest.freeTexts.length > 0) {
      textTypesRequest.freeTexts.forEach(ft => {
        const tag = new QueryTag(STRUCT_DOC);
        if (ft.value) {
          tag.name = ft.key;
          tag.value = ft.value;
          if (this.metadataQuery) {
            this.metadataQuery.tags.push([tag]);
          }
        }
      });
    }
    if (textTypesRequest.multiSelects && textTypesRequest.multiSelects.length > 0) {
      textTypesRequest.multiSelects.forEach(ms => {
        if (ms.values) {
          ms.values.forEach(v => {
            const tag = new QueryTag(STRUCT_DOC);
            tag.name = ms.key;
            tag.value = v;
            if (this.metadataQuery) {
              this.metadataQuery.tags.push([tag]);
            }
          });
        }
      });
    }
    if (textTypesRequest.singleSelects && textTypesRequest.singleSelects.length > 0) {
      const tag = new QueryTag(STRUCT_DOC);
      const singleSelect = textTypesRequest.singleSelects[0];
      if (singleSelect && singleSelect.value) {
        tag.name = singleSelect.key;
        tag.value = singleSelect.value;
        this.metadataQuery.tags.push([tag]);
      }
    }
    this.loadConcordances();
  }


  private init(): void {
    this.resultView = false;
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
    }
    /** Web Socket */
    this.initWebSocket();

    this.queryTypeStatus = false;
    this.contextStatus = false;
    this.textTypeStatus = false;

    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
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
    this.translateService.stream(VIEW_OPTIONS_LABEL).subscribe(res => {
      this.viewOptionsLabel = res
      this.titleOption = new KeyValueItem(VIEW_OPTIONS_LABEL, this.viewOptionsLabel);
    });
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

  private initWebSocket(): void {
    this.socketService.connect();
    const socketServiceSubject = this.socketService.getSocketSubject();
    if (socketServiceSubject) {
      socketServiceSubject.pipe(
        map(resp => {
          if (this.selectedCorpus) {
            const qr = resp as QueryResponse;
            if (qr.kwicLines.length > 0) {
              this.resultView = true;
              this.noResultFound = false;
              this.kwicLines = (resp as QueryResponse).kwicLines;
            } else {
              this.noResultFound = true;
            }
            this.loading = false;
            this.totalResults = qr.currentSize;
            this.simpleResult = this.simple;
          }
        }),
        catchError(err => { throw err }),
        tap({
          error: err => console.error(err),
          complete: () => console.log('IMPAQTS WS disconnected')
        })
      ).subscribe();
    }
  }

  public showVideoDlg(): void {
    const url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
    const start = Math.floor((Math.random() * 200) + 1);
    const end = start + Math.floor((Math.random() * 20) + 1);
    if (url?.length > 0) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1'
        + (start ? `&start=${start}` : '') + (end ? `&end=${end}` : ''));
    }
    this.displayModal = true;
  }
}
