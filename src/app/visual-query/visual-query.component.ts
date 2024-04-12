import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Message } from 'primeng/api';
import { v4 as uuid } from 'uuid';
import { STRUCT_DOC, TOKEN } from '../common/constants';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { VISUAL_QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { INSTALLATION } from '../model/constants';
import { Corpus } from '../model/corpus';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem, KeyValueItemExtended } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryToken } from '../model/query-token';
import { ResultContext } from '../model/result-context';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { AppInitializerService } from '../services/app-initializer.service';
import { DisplayPanelService } from '../services/display-panel.service';
import { ErrorMessagesService } from '../services/error-messages.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { SocketService } from '../services/socket.service';
import {
  ConcordanceRequestPayload,
  EmitterService,
} from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';
import { CorpusSelectionService } from '../services/corpus-selection.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { QueryStructure } from '../model/query-structure';

@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss'],
})
export class VisualQueryComponent implements OnInit, OnDestroy {
  public queryPattern: QueryPattern = new QueryPattern();
  public typeListQuery: KeyValueItem[] = [
    new KeyValueItem('word', 'word'),
    new KeyValueItem('lemma', 'lemma'),
    new KeyValueItem('tag', 'tag'),
    new KeyValueItem('status', 'status'),
    new KeyValueItem('lc', 'lc'),
    new KeyValueItem('lemma_lc', 'lemma_lc'),
  ];
  public actionList: KeyValueItemExtended[] = [
    new KeyValueItemExtended('IS', 'IS', false),
    new KeyValueItemExtended('IS_NOT', 'IS_NOT', false),
    new KeyValueItemExtended('BEGINS', 'BEGINS', false),
    new KeyValueItemExtended('CONTAINS', 'CONTAINS', false),
    new KeyValueItemExtended('ENDS', 'ENDS', false),
    new KeyValueItemExtended('REGEXP', 'REGEXP', true),
    new KeyValueItemExtended('NOT_REG', 'NOT_REG', true),
  ];
  public defaultType: KeyValueItem = new KeyValueItem('word', 'word');
  public defaulAction: KeyValueItemExtended = new KeyValueItemExtended(
    'IS',
    'IS',
    false
  );
  public optionList: KeyValueItem[] = [
    new KeyValueItem('1', 'repeat'),
    new KeyValueItem('2', 'sentence start'),
    new KeyValueItem('3', 'sentence end'),
  ];

  public metadataTextTypes: Array<Metadatum> = [];
  public metadata: QueryToken[] = [];

  public installation?: Installation;
  public corpusList: KeyValueItem[] = [];
  public selectedCorpus: KeyValueItem | null = null;
  public selectCorpus = SELECT_CORPUS_LABEL;

  public totalResults = 0;
  public simpleResult?: string;
  public kwicLines: Array<KWICline> = [];
  public TotalKwicline?: Array<KWICline>;

  public loading = false;
  public res: KeyValueItem[] = [];
  public enableAddToken = false;
  public enableAddMetadata = false;
  public enableSpinner = false;

  public visualQueryOptionsLabel = '';
  public viewOptionsLabel = '';
  public titleOption?: KeyValueItem;
  public wordListOptionsLabel = '';
  public sortOptionsLabel = '';
  public freqOptionsLabel = '';
  public collocationOptionsLabel = '';
  public filterOptionsLabel = '';
  public displayPanelOptions = false;
  public metadataAttributes: Array<KeyValueItem> = [];
  public textTypesAttributes: Array<KeyValueItem> = [];

  public resultView = false;
  public noResultFound = false;

  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public youtubeVideo = true;
  public resultContext: ResultContext | null = null;
  public paginations: number[] = [10, 25, 50];
  public initialPagination = 10;
  public titleResult: string | null = null;

  private holdSelectedCorpusId?: string;
  private corpusSelectedSubscription?: Subscription;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly socketService: SocketService,
    public displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly sanitizer: DomSanitizer,
    private readonly queryRequestService: QueryRequestService,
    private readonly appInitializerService: AppInitializerService,
    private readonly corpusSelectionService: CorpusSelectionService
  ) { }

  ngOnInit(): void {
    this.displayPanelService.menuItemClickSubject.next(VISUAL_QUERY);
    this.menuEmitterService.corpusSelected = false;
    this.init();
    this.corpusSelectedSubscription = this.corpusSelectionService.corpusSelectedSubject.subscribe(selectedCorpus => {
      this.titleResult = '';
      this.metadata = [];
      this.queryPattern.structPattern = new QueryStructure();
      this.selectedCorpus = selectedCorpus;
      this.corpusSelected();
    });
    if (this.corpusSelectionService.getSelectedCorpus()) {
      this.selectedCorpus = this.corpusSelectionService.getSelectedCorpus();
      this.corpusSelected();
    }
  }

  ngOnDestroy(): void {
    if (this.corpusSelectedSubscription) {
      this.corpusSelectedSubscription.unsubscribe();
    }
  }

  public addTokenQuery(): void {
    const token = new QueryToken(TOKEN);
    this.queryPattern.tokPattern.push(token);
  }

  public deleteTokenQuery(token: QueryToken): void {
    this.queryPattern.tokPattern.splice(
      this.queryPattern.tokPattern.indexOf(token),
      1
    );
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

  public makeConcordance(): void {
    this.titleResult = 'MENU.CONCORDANCE';
    const typeSearch = ['Query'];
    const fieldRequest = new FieldRequest();
    fieldRequest.selectedCorpus = this.selectedCorpus;
    const concordanceRequest: ConcordanceRequest = new ConcordanceRequest(
      fieldRequest,
      typeSearch
    );
    if (!!this.metadata[0]) {
      this.queryPattern.structPattern = this.metadata[0];
    }
    //replace empty string with .* everywhere
    const queryPatternToSend: QueryPattern = _.cloneDeep(this.queryPattern);
    if (
      queryPatternToSend.tokPattern &&
      queryPatternToSend.tokPattern.length > 0
    ) {
      queryPatternToSend.tokPattern.forEach((tag) => {
        if (tag.tags && tag.tags.length > 0) {
          tag.tags.forEach((aqt) => {
            if (aqt && aqt.length > 0) {
              aqt.forEach((qt) => {
                if (!qt.value || qt.value.trim() === '') {
                  qt.value = '.*';
                }
              });
            }
          });
        }
      });
    }
    queryPatternToSend.structPattern = this.cleanStructPattern(queryPatternToSend.structPattern);
    this.queryRequestService.setQueryPattern(queryPatternToSend);
    this.queryRequestService.getQueryRequest().queryType =
      REQUEST_TYPE.VISUAL_QUERY_REQUEST;
    this.queryRequestService.getQueryRequest().id = uuid();
    this.emitterService.makeConcordanceRequestSubject.next(
      new ConcordanceRequestPayload([concordanceRequest], 0)
    );
  }

  public corpusSelected(): void {
    this.resultView = false;
    this.noResultFound = false;
    localStorage.setItem(
      'selectedCorpus',
      JSON.stringify(this.selectedCorpus)
    );
    if (this.selectedCorpus) {
      this.menuEmitterService.corpusSelected = true;
      this.enableSpinner = true;
      this.enableAddToken = true;
      this.metadataAttributes = [];
      this.textTypesAttributes = [];
      if (this.installation && this.installation.corpora) {
        const selectedCorpusId = this.selectedCorpus.key;
        if (selectedCorpusId) {
          const corpus: Corpus = this.installation.corpora.filter(
            (corpus) => corpus.id === +selectedCorpusId
          )[0];
          this.socketService.setServerHost(corpus.name);
          corpus.metadata.sort((a, b) => a.position - b.position);
          corpus.metadata
            .filter((md) => !md.child)
            .forEach((md) => {
              // Attributes in View Options
              if (!md.documentMetadatum) {
                this.metadataAttributes.push(
                  new KeyValueItem(md.name, md.name)
                );
              } else {
                this.textTypesAttributes.push(
                  new KeyValueItem(md.name, md.name)
                );
              }
            });
        }
      }
      if (this.selectedCorpus.key !== this.holdSelectedCorpusId) {
        if (this.installation) {
          this.appInitializerService
            .loadCorpus(+this.selectedCorpus.key)
            .subscribe((corpus) => {
              this.setCorpus(corpus);
            });
        }
        this.holdSelectedCorpusId = this.selectedCorpus.key;
      } else {
        this.enableSpinner = false;
        this.enableAddMetadata = true;
      }
    } else {
      this.closeWebSocket();
      this.enableAddToken = false;
      this.enableAddMetadata = false;
      this.enableSpinner = false;
      this.menuEmitterService.corpusSelected = false;
      this.kwicLines = [];
      this.metadata = [];
      this.queryPattern.tokPattern = [];
    }
    this.menuEmitterService.menuEvent$.next(new MenuEvent(VISUAL_QUERY));
  }

  public getMetadatumTextTypes(): Metadatum[] {
    return this.metadataTextTypes;
  }

  public atLeastOneToken(): boolean {
    return this.queryPattern.tokPattern.length > 0;
  }

  public showDialog(kwicline: KWICline): void {
    // kwicline.ref to retrive info
    this.resultContext = new ResultContext(
      kwicline.kwic,
      KWICline.stripTags(kwicline.leftContext, false),
      KWICline.stripTags(kwicline.rightContext, false)
    );
  }

  public showVideoDlg(rowIndex: number): void {
    this.youtubeVideo = rowIndex % 2 > 0;
    let url = '';

    if (this.youtubeVideo) {
      url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
      const start = Math.floor(Math.random() * 200 + 1);
      const end = start + Math.floor(Math.random() * 20 + 1);
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          url +
          '?autoplay=1' +
          (start ? `&start=${start}` : '') +
          (end ? `&end=${end}` : '')
        );
      }
    } else {
      url = 'https://player.vimeo.com/video/637089218';
      const start =
        Math.floor(Math.random() * 5 + 1) +
        'm' +
        Math.floor(Math.random() * 60 + 1) +
        's';
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${url}?autoplay=1#t=${start}`
        );
      }
    }

    this.displayModal = true;
  }

  private closeWebSocket(): void {
    this.socketService.closeSocket();
  }

  private init(): void {
    this.displayPanelService.reset();
    this.resultView = false;
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach((corpus) =>
        this.corpusList.push(new KeyValueItem(`${corpus.id}`, corpus.name))
      );
    }

    this.translateService
      .stream(SELECT_CORPUS_LABEL)
      .subscribe((res: any) => (this.selectCorpus = res));
  }

  private setCorpus(corpus: Corpus): void {
    const metadataVQStr = localStorage.getItem('metadataVQ');
    if (this.corpusSelectionService.getCorpusChanged() || this.corpusSelectionService.getPageLoadedFirstTime()
      || !metadataVQStr || this.metadataQueryService.getMetadataVQIdCorpus() !== '' + corpus.id) {
      this.metadataUtilService
        .createMatadataTree(`${corpus.id}`, this.installation, true)
        .subscribe({
          next: (metadata) => {
            this.metadataQueryService.setMetadata(metadata);
            this.metadataTextTypes = metadata;
          },
          error: (err) => {
            this.enableSpinner = false;
            const metadataErrorMsg = {} as Message;
            metadataErrorMsg.severity = 'error';
            metadataErrorMsg.detail = 'Impossibile recuperare i metadati';
            metadataErrorMsg.summary = 'Errore';
            this.errorMessagesService.sendError(metadataErrorMsg);
          },
          complete: () => {
            this.metadataQueryService.storageMetadataVQ();
            this.enableSpinner = false;
            this.enableAddMetadata = true;
          },
        });
    } else {
      this.metadataTextTypes = this.metadataQueryService.getMetadataVQ();
      this.corpusSelectionService.setPageLoadedFirstTime(false);
      this.enableSpinner = false;
      this.enableAddMetadata = true;
    }
  }

  private cleanStructPattern(structPattern: QueryStructure): QueryStructure {
    if (structPattern && structPattern.tags && structPattern.tags.length > 0) {
      structPattern.tags = structPattern.tags.map(tags => tags.filter(tag => tag.value.length > 0));
    }
    structPattern.tags = structPattern.tags.filter(tags => tags.length > 0);
    return structPattern;
  }
}
