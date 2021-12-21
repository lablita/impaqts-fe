import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { catchError, map, tap } from 'rxjs/operators';
import { STRUCT_DOC, TEXT_TYPES_QUERY_REQUEST, TOKEN } from '../common/constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import {
  CHARACTER, CONCORDANCE, CONCORDANCE_CHARACTER,
  CONCORDANCE_CQL, CONCORDANCE_LEMMA, CONCORDANCE_PHRASE,
  CONCORDANCE_SIMPLE, CONCORDANCE_WORD, CQL, INSTALLATION, LEMMA, PHRASE,
  RESULT_CONCORDANCE, SELECT_CORPUS, SIMPLE, VIEW_OPTIONS_LABEL, WORD
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
import { ResultContext } from '../model/result-context';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
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
  public matchCase: boolean = false;
  public defaultAttributeCQL: KeyValueItem | null = null;
  public defaultAttributeCQLList: KeyValueItem[] = [new KeyValueItem('WORD', 'WORD'), new KeyValueItem('TAG', 'TAG'), new KeyValueItem('LEMMA', 'LEMMA'), new KeyValueItem('WORD_LC', 'WORD_LC'), new KeyValueItem('LEMMA_LC', 'LEMMA_LC')];
  // public defaultAttributeCQLList: string[] = ['WORD', 'TAG', 'LEMMA', 'WORD_LC', 'LEMMA_LC'];
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

  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public resultContext: ResultContext | null = null;

  /** private */
  private metadataQuery: QueryToken | null = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly socketService: SocketService,
    private readonly metadataQueryService: MetadataQueryService,
    public displayPanelService: DisplayPanelService,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.emitterService.pageMenu = CONCORDANCE;
    this.translateService.stream(VIEW_OPTIONS_LABEL).
      subscribe(res => this.emitterService.clickLabel.emit(new KeyValueItem(VIEW_OPTIONS_LABEL, res)));
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
      this.displayPanelMetadata = false;
      this.displayPanelOptions = false;

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
            this.metadataQueryService.metadata = res['md'];
            this.endedMetadataProcess = res['ended'];
            if (this.endedMetadataProcess) {
              this.emitterService.clickLabelMetadataDisabled.emit(!this.selectedCorpus || !this.textTypeStatus);
              //ordinamento position 
              this.metadataQueryService.metadata.sort((a, b) => a.position - b.position);
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
    this.menuEmitterService.menuEvent$.next(new MenuEvent(CONCORDANCE));
  }

  public makeConcordances(): void {
    this.loading = true;
    this.resultView = false;
    this.loadConcordances();
  }

  public loadConcordances(event?: LazyLoadEvent): void {
    this.setMetadataQuery();
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
      this.menuEmitterService.menuEvent$.next(new MenuEvent(RESULT_CONCORDANCE));
    }
  }

  public setMetadataQuery(): void {
    //** Metadata */
    const textTypesRequest = new TextTypesRequest();
    this.metadataQueryService.metadata.forEach(md => {
      if (!!md.selection) {
        if (md.freeText) {
          //freetxt
          textTypesRequest.freeTexts.push(new Selection(md.name, md.selection as string));
        } else if (!md.multipleChoice && md.tree && md.tree[0] && md.tree[0].children && md.tree[0].children.length > 0) {
          //single
          textTypesRequest.singleSelects.push(new Selection(md.name, (md.selection as TreeNode).label));
        } else {
          //multi
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

    this.translateService.stream(SELECT_CORPUS).subscribe(res => this.selectCorpus = res);

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
      const start = Math.floor((Math.random() * 5) + 1) + 'm' + Math.floor((Math.random() * 60) + 1) + 's';
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${url}?autoplay=1#t=${start}`);
      }
    }

    this.displayModal = true;
  }

  public showDialog(kwicline: KWICline): void {
    // kwicline.ref to retrive info
    this.resultContext = new ResultContext(kwicline.kwic, kwicline.leftContext + kwicline.leftContext, kwicline.rightContext + kwicline.rightContext);
  }


}
