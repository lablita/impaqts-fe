import { Component, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventEmitter } from 'stream';
import { WS, WSS } from '../common/constants';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CHARACTER, CQL, LEMMA, PHRASE, WORD } from '../common/query-constants';
import { QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { ContextConcordanceQueryRequestDTO } from '../model/context-concordance-query-request-dto';
import { Corpus } from '../model/corpus';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { SocketService } from '../services/socket.service';
import { ConcordanceRequestPayLoad, EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';

@Component({
  selector: 'app-query-request',
  templateUrl: './query-request.component.html',
  styleUrls: ['./query-request.component.scss']
})
export class QueryRequestComponent implements OnInit {

  @Output() visibiltyChange = new EventEmitter();

  public corpusList: KeyValueItem[] = [];
  public selectedCorpus: KeyValueItem | null = null;
  public selectCorpus = SELECT_CORPUS_LABEL;
  public simple = '';
  public phrase = '';
  public word = '';
  public character = '';
  public cql = '';
  public matchCase = false;
  public selectedQueryType: KeyValueItem | null = null;
  public displayContext = false;
  public displayQueryType = false;
  public queryTypes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public lemma = '';
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();

  private simpleResult = '';
  private holdSelectedCorpusStr = '';
  private installation?: Installation;
  private endedMetadataProcess = false;
  private textTypeStatus = false;
  private fieldRequest: FieldRequest | null = null;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    public readonly displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly socketService: SocketService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly menuEmitterService: MenuEmitterService,
  ) { }

  ngOnInit(): void {
  }

  public corpusSelect(): void {
    this.titleResult = '';
    this.clickTextType();
    this.displayPanelService.reset();
    this.queryRequestService.resetOptionsRequest();
    if (this.selectedCorpus) {
      this.emitterService.spinnerMetadata.emit(true);
      this.metadataAttributes = [];
      this.textTypesAttributes = [];
      if (this.installation && this.installation.corpora) {
        const selectedCorpusKey = this.selectedCorpus.key;
        if (selectedCorpusKey) {
          const corpora: Corpus = this.installation.corpora.filter(corpus => corpus.name === selectedCorpusKey)[0];
          const endpoint = environment.secureUrl ? WSS + corpora.endpoint : WS + corpora.endpoint;
          this.socketService.setServerHost(endpoint);
          corpora.metadata.sort((a, b) => a.position - b.position);
          corpora.metadata.filter(md => !md.child).forEach(md => {
            // Attributes in View Options
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
                  this.displayPanelService.labelMetadataSubject.next(!!this.selectedCorpus && !!this.textTypeStatus);
                  // ordinamento position
                  this.metadataQueryService.metadata.sort((a, b) => a.position - b.position);
                  this.emitterService.spinnerMetadata.emit(false);
                }
              }
            });
        }
        this.holdSelectedCorpusStr = this.selectedCorpus.key;
      } else {
        this.displayPanelService.labelMetadataSubject.next(!!this.selectedCorpus && !!this.textTypeStatus);
        this.emitterService.spinnerMetadata.emit(false);
        this.endedMetadataProcess = true;
      }
    } else {
      this.closeWebSocket();
      this.menuEmitterService.corpusSelected = false;
      this.simple = '';
      this.hideQueryTypeAndContext();
    }
    this.menuEmitterService.menuEvent$.next(new MenuEvent(QUERY));
  }

  public makeConcordances(sortQueryRequest?: SortQueryRequest): void {
    localStorage.setItem('selectedCorpus', JSON.stringify(this.selectedCorpus));
    localStorage.setItem('simpleQuery', this.simple);
    if (!sortQueryRequest) {
      this.queryRequestService.resetOptionsRequest();
    }
    let typeSearch = ['Query'];
    this.titleResult = 'MENU.CONCORDANCE';
    this.fieldRequest = FieldRequest.build(
      this.selectedCorpus,
      this.simpleResult,
      this.simple,
      this.lemma,
      this.phrase,
      this.word,
      this.character,
      this.cql,
      this.matchCase,
      this.selectedQueryType);
    // concordance Context
    this.fieldRequest.contextConcordance = this.contextConcordanceQueryRequestDTO;
    if (sortQueryRequest && !!sortQueryRequest.sortKey) {
      typeSearch = ['Sort', sortQueryRequest.sortKey!];
    } else if (this.queryRequestService.queryRequest.sortQueryRequest
      && this.queryRequestService.queryRequest.sortQueryRequest !== undefined) {
      typeSearch = ['Sort', !!this.queryRequestService.queryRequest.sortQueryRequest.sortKey
        ? this.queryRequestService.queryRequest.sortQueryRequest.sortKey : 'MULTILEVEL_CONTEXT'];
    }
    this.emitterService.makeConcordance.next(new ConcordanceRequestPayLoad([new ConcordanceRequest(this.fieldRequest, typeSearch)], 0));
  }

  public clickQueryType(): void {
    this.displayQueryType = !this.displayQueryType;
  }

  public clickContext(): void {
    this.displayContext = !this.displayContext;
    this.clearContextFields();
  }

  public clickTextType(): void {
    this.textTypeStatus = true;
    this.displayPanelService.labelMetadataSubject.next(!this.textTypeStatus);
  }

  public clearContextFields(): void {
    this.contextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();
  }

  private closeWebSocket(): void {
    this.socketService.closeSocket();
  }

  private hideQueryTypeAndContext(): void {
    this.displayContext = false;
    this.displayQueryType = false;
  }
}
