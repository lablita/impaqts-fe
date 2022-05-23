import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, SortEvent, TreeNode } from 'primeng/api';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { STRUCT_DOC, TEXT_TYPES_QUERY_REQUEST, TOKEN, WS, WSS } from '../common/constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { CollocationItem } from '../model/collocation-item';
import {
  CHARACTER, CONCORDANCE, CQL, INSTALLATION, LEMMA, PHRASE,
  RESULT_CONCORDANCE, SELECT_CORPUS, SIMPLE, WORD
} from '../model/constants';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { Corpus } from '../model/corpus';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';
import { ResultContext } from '../model/result-context';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
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

  /** public */
  public installation?: Installation;
  public corpusList: KeyValueItem[] = [];
  public metadataTextTypes: Metadatum[] = [];

  public lemma = '';
  public selectedCorpus: KeyValueItem | null = null;
  public queryTypes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedQueryType: KeyValueItem | null = null;
  public selectCorpus = SELECT_CORPUS;
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public titleOption: KeyValueItem | null = null;
  public simple = '';
  public phrase = '';
  public word = '';
  public character = '';
  public cql = '';
  public queryTypeStatus = false;
  public contextStatus = false;
  public textTypeStatus = false;
  public attributesSelection: string[] = [];
  public viewOptionsLabel = '';
  public wordListOptionsLabel = '';
  public visualQueryOptionsLabel = '';
  public sortOptionsLabel = '';
  public freqOptionsLabel = '';
  public collocationOptionsLabel = '';
  public filterOptionsLabel = '';
  public matchCase = false;
  public defaultAttributeCQL: KeyValueItem | null = null;
  public defaultAttributeCQLList: KeyValueItem[] = [
    new KeyValueItem('WORD', 'WORD'),
    new KeyValueItem('TAG', 'TAG'),
    new KeyValueItem('LEMMA', 'LEMMA'),
    new KeyValueItem('WORD_LC', 'WORD_LC'),
    new KeyValueItem('LEMMA_LC', 'LEMMA_LC')
  ];
  public totalResults = 0;
  public kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  public collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  public totalKwicline: Array<KWICline> = Array.from<KWICline>({ length: 0 });

  public metadataAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public textTypesAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  public loading = false;
  public totalRecords = 0;
  public simpleResult = '';

  public endedMetadataProcess = false;
  public holdSelectedCorpusStr = '';

  public resultView = false;
  public noResultFound = false;

  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public resultContext: ResultContext | null = null;
  public colHeaderList: KeyValueItem[] = [
    new KeyValueItem('r', 'PAGE.COLLOCATION.CONC_COUNT'),
    new KeyValueItem('f', 'PAGE.COLLOCATION.CAND_COUNT'),
    new KeyValueItem('t', 'PAGE.COLLOCATION.T_SCORE'),
    new KeyValueItem('m', 'PAGE.COLLOCATION.MI'),
    new KeyValueItem('3', 'PAGE.COLLOCATION.MI3'),
    new KeyValueItem('l', 'PAGE.COLLOCATION.LOG_LIKELIHOOD'),
    new KeyValueItem('s', 'PAGE.COLLOCATION.MIN_SENS'),
    new KeyValueItem('d', 'PAGE.COLLOCATION.LOG_DICE'),
    new KeyValueItem('p', 'PAGE.COLLOCATION.MI_LOG_F')
  ];
  public colHeader: Array<string> = Array.from<string>({ length: 0 });
  public titleResult: string | null = null;
  public headerSortBy = '';
  public defaultSortOrder = 1;

  /** private */
  private endpoint = '';
  private metadataQuery: QueryToken | null = null;

  constructor(
    private readonly translateService: TranslateService,
    public menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly socketService: SocketService,
    private readonly metadataQueryService: MetadataQueryService,
    public displayPanelService: DisplayPanelService,
    private readonly sanitizer: DomSanitizer,
    private readonly queryRequestSevice: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.emitterService.pageMenu = CONCORDANCE;
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.menuEvent$.next(new MenuEvent(CONCORDANCE));
    this.init();
  }

  public clickQueryType(): void {
    this.queryTypeStatus = !this.queryTypeStatus;
  }

  public clickContext(): void {
    this.contextStatus = !this.contextStatus;
  }

  public clickTextType(): void {
    this.textTypeStatus = true;
    this.displayPanelService.labelMetadataDisabled = !!this.textTypeStatus;
  }

  public clickClearAll(): void {
    return;
  }

  public dropdownCorpus(): void {
    this.resultView = false;
    this.noResultFound = false;
    this.clickTextType();
    this.displayPanelService.reset();
    this.queryRequestSevice.resetOptionsRequest();
    if (this.selectedCorpus) {
      this.emitterService.spinnerMetadata.emit(true);
      this.metadataAttributes = [];
      this.textTypesAttributes = [];
      if (this.installation && this.installation.corpora) {
        const selectedCorpusKey = this.selectedCorpus.key;
        if (selectedCorpusKey) {
          this.closeWebSocket();
          const corpora: Corpus = this.installation.corpora.filter(corpus => corpus.name === selectedCorpusKey)[0];
          this.endpoint = environment.secureUrl ? WSS + corpora.endpoint : WS + corpora.endpoint;
          this.socketService.setServerHost(this.endpoint);
          /** Web Socket */
          this.initWebSocket();
          corpora.metadata.sort((a, b) => a.position - b.position);
          corpora.metadata.filter(md => !md.child).forEach(md => {
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
          this.metadataUtilService.createMatadataTree(this.selectedCorpus.key, this.installation, false).subscribe(
            {
              next: res => {
                this.metadataQueryService.metadata = res.md;
                this.endedMetadataProcess = res.ended;
                if (this.endedMetadataProcess) {
                  this.displayPanelService.labelMetadataDisabled = !this.selectedCorpus || !this.textTypeStatus;
                  // ordinamento position
                  this.metadataQueryService.metadata.sort((a, b) => a.position - b.position);
                  this.emitterService.spinnerMetadata.emit(false);
                }
              }
            });
        }
        this.holdSelectedCorpusStr = this.selectedCorpus.key;
      } else {
        this.displayPanelService.labelMetadataDisabled = !this.selectedCorpus || !this.textTypeStatus;
        this.emitterService.spinnerMetadata.emit(false);
        this.endedMetadataProcess = true;
      }
    } else {
      this.closeWebSocket();
      this.menuEmitterService.corpusSelected = false;
      this.simple = '';
      this.kwicLines = Array.from<KWICline>({ length: 0 });
      this.contextStatus = false;
      this.queryTypeStatus = false;
    }
    this.menuEmitterService.menuEvent$.next(new MenuEvent(CONCORDANCE));
  }

  public makeConcordances(): void {
    this.titleResult = 'MENU.CONCORDANCE';
    this.kwicLines = [];
    this.collocations = [];
    this.loading = true;
    this.resultView = false;
    this.queryRequestSevice.resetOptionsRequest();
    this.loadResults();
  }

  public makeCollocations(): void {
    this.titleResult = 'MENU.COLLOCATIONS';
    const sortBy = this.queryRequestSevice.queryRequest.collocationQueryRequest?.sortBy;
    this.headerSortBy = this.colHeaderList.filter(h => h.key === sortBy)[0].value;
    this.loadResults();
  }

  public loadResults(event?: LazyLoadEvent): void {
    this.setMetadataQuery();
    if (!!this.selectedCorpus) {
      const qr: QueryRequest = JSON.parse(JSON.stringify(this.queryRequestSevice.queryRequest));
      if (!event) {
        qr.start = 0;
        qr.end = 10;
      } else {
        if (event.first !== undefined && event.first !== null && event.rows !== undefined && event.rows !== null) {
          qr.start = event.first;
          qr.end = qr.start + event.rows;
        }
      }
      let queryTags: QueryTag[] = [];
      let tag: QueryTag;
      switch (this.selectedQueryType?.key) {
        case WORD:
          tag = this.tagBuilder('word', this.word);
          tag.matchCase = this.matchCase;
          queryTags.push(tag);
          break;
        case LEMMA:
          queryTags.push(this.tagBuilder('lemma', this.lemma));
          break;
        case PHRASE:
          queryTags.push(this.tagBuilder('phrase', this.phrase));
          break;
        case CHARACTER:
          queryTags.push(this.tagBuilder('character', this.character));
          break;
        case CQL:
          tag = this.tagBuilder('cql', this.word);
          tag.defaultAttributeCQL = this.defaultAttributeCQL?.key ? this.defaultAttributeCQL?.key : '';
          queryTags.push(this.tagBuilder('cql', this.cql));
          break;
        default: //SIMPLE
          queryTags.push(this.tagBuilder('word', this.simple));
          queryTags.push(this.tagBuilder('lemma', this.simple));
      }
      qr.queryPattern = new QueryPattern();
      qr.queryPattern.tokPattern = Array.from<QueryToken>({ length: 0 });
      const simpleQueryToken = new QueryToken(TOKEN);
      // release develop_guasti
      simpleQueryToken.tags[0] = queryTags;

      // release visualQuery
      // const simpleQueryTag = new QueryTag(TOKEN);
      // simpleQueryTag.name = 'word';
      // simpleQueryTag.value = this.simple;
      // simpleQueryToken.tags[0][0] = simpleQueryTag;
      /* */

      if (qr.collocationQueryRequest?.showFunc && qr.collocationQueryRequest?.showFunc?.length > 0) {
        this.colHeader = ['PAGE.COLLOCATION.CONC_COUNT', 'PAGE.COLLOCATION.CAND_COUNT'];
        qr.collocationQueryRequest.showFunc.forEach(f => this.colHeader.push(this.colHeaderList.filter(h => h.key === f)[0].value));
      }

      qr.queryPattern.tokPattern.push(simpleQueryToken);
      if (this.metadataQuery) {
        qr.queryPattern.structPattern = this.metadataQuery;
      }
      qr.corpus = this.selectedCorpus.key;
      this.socketService.sendMessage(qr);
      this.menuEmitterService.menuEvent$.next(new MenuEvent(RESULT_CONCORDANCE));
    }
  }

  public setMetadataQuery(): void {
    /** Metadata */
    const textTypesRequest = new TextTypesRequest();
    this.metadataQueryService.metadata.forEach(md => {
      if (!!md.selection) {
        if (md.freeText) {
          // freetxt
          textTypesRequest.freeTexts.push(new Selection(md.name, md.selection as string));
        } else if (!md.multipleChoice && md.tree && md.tree[0] && md.tree[0].children && md.tree[0].children.length > 0) {
          // single
          textTypesRequest.singleSelects.push(new Selection(md.name, (md.selection as TreeNode).label));
        } else {
          // multi
          const values: string[] = [];
          (md.selection as TreeNode[]).forEach(m => {
            if (m.label) {
              values.push(m.label);
            }
          });
          textTypesRequest.multiSelects.push(new Selection(md.name, undefined, values));
        }
      }
    });
    localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(textTypesRequest));
    // Tutto in OR
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
  }

  public showVideoDlg(rowIndex: number): void {
    const youtubeVideo = rowIndex % 2 > 0;
    let url = '';

    if (youtubeVideo) {
      url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
      const start = Math.floor((Math.random() * 200) + 1);
      const end = start + Math.floor((Math.random() * 20) + 1);
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${url}?autoplay=1&start=${start}&end=${end}`
        );
      }
    } else {
      url = 'https://player.vimeo.com/video/637089218';
      const start = `${Math.floor((Math.random() * 5) + 1)}m${Math.floor((Math.random() * 60) + 1)}s`;
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${url}?autoplay=1#t=${start}`);
      }
    }

    this.displayModal = true;
  }

  public showDialog(kwicline: KWICline): void {
    // kwicline.ref to retrive info
    this.resultContext = new ResultContext(kwicline.kwic,
      kwicline.leftContext + kwicline.leftContext, kwicline.rightContext + kwicline.rightContext);
  }

  public collocationCustomSort(event: SortEvent): void {

    console.log("..." + JSON.stringify(event.order));
  }

  private init(): void {
    this.resultView = false;
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
    }

    this.queryTypeStatus = false;
    this.contextStatus = false;
    this.textTypeStatus = false;

    this.translateService.stream(SELECT_CORPUS).subscribe({
      next: res => this.selectCorpus = res
    });

    this.queryTypes = [
      new KeyValueItem(SIMPLE, SIMPLE),
      new KeyValueItem(LEMMA, LEMMA),
      new KeyValueItem(WORD, WORD),
      new KeyValueItem(PHRASE, PHRASE),
      new KeyValueItem(CHARACTER, CHARACTER),
      new KeyValueItem(CQL, CQL)
    ];

    this.selectedQueryType = this.queryTypes[0];
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
            } else if (qr.collocations.length > 0) {
              this.resultView = true;
              this.noResultFound = false;
              this.collocations = (resp as QueryResponse).collocations;
            } else {
              this.noResultFound = true;
            }
            this.loading = false;
            this.totalResults = qr.currentSize;
            this.simpleResult = this.simple;
          }
        }),
        catchError(err => { throw err; }),
        tap({
          error: err => console.error(err),
          complete: () => console.log('IMPAQTS WS disconnected')
        })
      ).subscribe({
        next: () => {
          this.displayPanelService.labelOptionsDisabled = !this.resultView;
          this.menuEmitterService.corpusSelected = this.resultView;
          this.menuEmitterService.menuEvent$.next(new MenuEvent(CONCORDANCE));
        }
      });
    }
  }

  private closeWebSocket(): void {
    this.socketService.closeSocket();
  }

  private tagBuilder(type: string, value: string): QueryTag {
    const tag = new QueryTag(TOKEN);
    tag.name = type;
    tag.value = value;
    return tag;
  }

}
