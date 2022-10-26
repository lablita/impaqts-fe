import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { STRUCT_DOC, TOKEN, WS, WSS } from '../common/constants';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { VISUAL_QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { INSTALLATION } from '../model/constants';
import { Corpus } from '../model/corpus';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
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
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';

@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss']
})

export class VisualQueryComponent implements OnInit {

  public queryPattern: QueryPattern = new QueryPattern();
  public typeListQuery: KeyValueItem[] = [
    new KeyValueItem('word', 'word'), new KeyValueItem('lemma', 'lemma'), new KeyValueItem('tag', 'tag'),
    new KeyValueItem('status', 'status'), new KeyValueItem('lc', 'lc'), new KeyValueItem('lemma_lc', 'lemma_lc')];
  public actionList: KeyValueItem[] = [
    new KeyValueItem('IS', 'IS'),
    new KeyValueItem('IS_NOT', 'IS_NOT'),
    new KeyValueItem('BEGINS', 'BEGINS'),
    new KeyValueItem('CONTAINS', 'CONTAINS'),
    new KeyValueItem('ENDS', 'ENDS'),
    new KeyValueItem('REGEXP', 'REGEXP'),
    new KeyValueItem('NOT_REG', 'NOT_REG')];
  public defaultType: KeyValueItem = new KeyValueItem('word', 'word');
  public defaulAction: KeyValueItem = new KeyValueItem('IS', 'IS');
  public optionList: KeyValueItem[] = [new KeyValueItem('1', 'repeat'), new KeyValueItem('2', 'sentence start'), new KeyValueItem('3', 'sentence end')];

  public metadataTextTypes: Array<Metadatum> = Array.from<Metadatum>({ length: 0 });
  public metadata: QueryToken[] = [];

  public installation?: Installation;
  public corpusList: KeyValueItem[] = [];
  public selectedCorpus: KeyValueItem | null = null;
  public selectCorpus = SELECT_CORPUS_LABEL;

  public totalResults = 0;
  public simpleResult?: string;
  public kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
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
  public metadataAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public textTypesAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  public resultView = false;
  public noResultFound = false;

  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public youtubeVideo = true;
  public resultContext: ResultContext | null = null;
  public paginations: number[] = [10, 25, 50];
  public initialPagination = 10;
  public titleResult: string | null = null;

  private endpoint = '';
  private holdSelectedCorpusId?: string;

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
    private readonly appInitializerService: AppInitializerService
  ) { }

  ngOnInit(): void {
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.menuEvent$.next(new MenuEvent(VISUAL_QUERY));
    this.init();
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

  public makeConcordance(): void {
    this.titleResult = 'MENU.CONCORDANCE';
    const typeSearch = ['Query'];
    const fieldRequest = new FieldRequest();
    fieldRequest.selectedCorpus = this.selectedCorpus;
    const concordanceRequest: ConcordanceRequest = new ConcordanceRequest(fieldRequest, typeSearch);
    if (!!this.metadata[0]) {
      this.queryPattern.structPattern = this.metadata[0];
    }
    this.queryRequestService.setQueryPattern(this.queryPattern);
    this.emitterService.makeConcordance.next(
      new ConcordanceRequestPayload([concordanceRequest], 0, this.queryRequestService.getQueryPattern()));
  }

  public corpusSelect(): void {
    this.resultView = false;
    this.noResultFound = false;
    if (this.selectedCorpus) {
      this.menuEmitterService.corpusSelected = true;
      this.enableSpinner = true;
      this.enableAddToken = true;
      this.metadataAttributes = [];
      this.textTypesAttributes = [];
      if (this.installation && this.installation.corpora) {
        const selectedCorpusId = this.selectedCorpus.key;
        if (selectedCorpusId) {
          const corpus: Corpus = this.installation.corpora.filter(corpus => corpus.id === +selectedCorpusId)[0];
          this.endpoint = environment.secureUrl ? WSS + corpus.endpoint : WS + corpus.endpoint;
          this.socketService.setServerHost(this.endpoint);
          corpus.metadata.sort((a, b) => a.position - b.position);
          corpus.metadata.filter(md => !md.child).forEach(md => {
            // Attributes in View Options
            if (!md.documentMetadatum) {
              this.metadataAttributes.push(new KeyValueItem(md.name, md.name));
            } else {
              this.textTypesAttributes.push(new KeyValueItem(md.name, md.name));
            }
          });
        }
      }
      if (this.selectedCorpus.key !== this.holdSelectedCorpusId) {
        if (this.installation) {
          this.appInitializerService.loadCorpus(+this.selectedCorpus.key).subscribe(corpus => {
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
      this.kwicLines = Array.from<KWICline>({ length: 0 });
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
    this.resultContext = new ResultContext(kwicline.kwic, KWICline.stripTags(kwicline.leftContext, false),
      KWICline.stripTags(kwicline.rightContext, false));
  }

  public showVideoDlg(rowIndex: number): void {
    this.youtubeVideo = rowIndex % 2 > 0;
    let url = '';

    if (this.youtubeVideo) {
      url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
      const start = Math.floor((Math.random() * 200) + 1);
      const end = start + Math.floor((Math.random() * 20) + 1);
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1'
          + (start ? `&start=${start}` : '') + (end ? `&end=${end}` : ''));
      }
    } else {
      url = 'https://player.vimeo.com/video/637089218';
      const start = Math.floor((Math.random() * 5) + 1) + 'm' + Math.floor((Math.random() * 60) + 1) + 's';
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1#t=' + start);
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
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(`${corpus.id}`, corpus.name)));
    }

    this.translateService.stream(SELECT_CORPUS_LABEL).subscribe((res: any) => this.selectCorpus = res);
  }

  private setCorpus(corpus: Corpus): void {
<<<<<<< HEAD
    const installation = this.installation;
    if (installation) {
      installation.corpora.forEach((c, index) => {
        if (c.id === corpus.id) {
          installation.corpora[index] = c;
        }
      });
      this.metadataUtilService.createMatadataTree(
        `${corpus.id}`, this.installation, true).subscribe(
          {
            next: metadata => this.metadata = metadata;
            error: err => {
              this.enableSpinner = false;
              const metadataErrorMsg = {} as Message;
              metadataErrorMsg.severity = 'error';
              metadataErrorMsg.detail = 'Impossibile recuperare i metadati';
              metadataErrorMsg.summary = 'Errore';
              this.errorMessagesService.sendError(metadataErrorMsg);
            },
            complete: () => {
              this.enableSpinner = false;
              this.enableAddMetadata = true;
            }
          });
    }
=======
    this.metadataUtilService.createMatadataTree(
      `${corpus.id}`, this.installation, true).subscribe(
        {
          next: metadata => this.metadata = metadata;
          error: err => {
            this.enableSpinner = false;
            const metadataErrorMsg = {} as Message;
            metadataErrorMsg.severity = 'error';
            metadataErrorMsg.detail = 'Impossibile recuperare i metadati';
            metadataErrorMsg.summary = 'Errore';
            this.errorMessagesService.sendError(metadataErrorMsg);
          },
          complete: () => {
            this.enableSpinner = false;
            this.enableAddMetadata = true;
          }
        });
>>>>>>> 9a62f7b875fb217572b8e3c3d55b9b0837d137aa
  }

}
