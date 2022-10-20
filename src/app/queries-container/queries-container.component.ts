import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WS, WSS } from '../common/constants';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CHARACTER, CQL, LEMMA, PHRASE, SIMPLE, WORD } from '../common/query-constants';
import { QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { INSTALLATION } from '../model/constants';
import { ContextConcordanceQueryRequestDTO } from '../model/context-concordance-query-request-dto';
import { Corpus } from '../model/corpus';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { ResultContext } from '../model/result-context';
import { SortQueryRequest } from '../model/sort-query-request';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { SocketService } from '../services/socket.service';
import { ConcordanceRequestPayLoad, EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';

export class ConcordanceRequest {
  fieldRequest: FieldRequest = new FieldRequest();
  sortOptions: string[] = [];

  constructor(fieldRequest: FieldRequest, typeSearch: string[]) {
    this.fieldRequest = fieldRequest;
    this.sortOptions = typeSearch;
  }
}

@Component({
  selector: 'app-concordance',
  templateUrl: './queries-container.component.html',
  styleUrls: ['./queries-container.component.scss']
})
export class QueriesContainerComponent implements OnInit, AfterViewInit {

  public contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();

  /** public */
  public fieldRequest: FieldRequest | null = null;
  public installation?: Installation;
  public corpusList: KeyValueItem[] = [];
  public metadataTextTypes: Metadatum[] = [];

  public lemma = '';
  public selectedCorpus: KeyValueItem | null = null;
  public queryTypes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedQueryType: KeyValueItem | null = null;
  public selectCorpus = SELECT_CORPUS_LABEL;
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
  public attributesSelection: string[] = [];
  public viewOptionsLabel = '';
  public wordListOptionsLabel = '';
  public visualQueryOptionsLabel = '';
  public sortOptionsLabel = '';
  public freqOptionsLabel = '';
  public collocationOptionsLabel = '';
  public filterOptionsLabel = '';
  public matchCase = false;
  public totalResults = 0;
  public metadataAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public textTypesAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  public simpleResult = '';
  public endedMetadataProcess = false;
  public holdSelectedCorpusStr = '';
  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public resultContext: ResultContext | null = null;
  public colHeader: Array<string> = Array.from<string>({ length: 0 });
  public titleResult: string | null = null;
  public headerSortBy = '';
  public paginations: number[] = [10, 25, 50];
  public initialPagination = 10;

  public displayResultPanel = false;
  public displayQueryType = false;
  public displayContext = false;
  public categories: Array<string> = Array.from<string>({ length: 0 });

  /** private */
  private endpoint = '';
  private textTypeStatus = false;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly socketService: SocketService,
    private readonly metadataQueryService: MetadataQueryService,
    public readonly displayPanelService: DisplayPanelService,
    public queryRequestService: QueryRequestService,
  ) { }

  ngOnInit(): void {
    this.displayPanelService.reset();
    this.emitterService.pageMenu = QUERY;
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.menuEvent$.next(new MenuEvent(QUERY));
  }

  ngAfterViewInit(): void {
    this.init();
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

  public dropdownCorpus(): void {
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
          this.endpoint = environment.secureUrl ? WSS + corpora.endpoint : WS + corpora.endpoint;
          this.socketService.setServerHost(this.endpoint);
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
    this.updateVisibilityFlags();
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
    //concordance Context
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

  public makeCollocations(): void {
    this.titleResult = 'MENU.COLLOCATIONS';
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
    this.emitterService.makeCollocation.next(this.fieldRequest);
  }

  public makeFrequency(): void {
    this.categories = this.queryRequestService.queryRequest.frequencyQueryRequest?.categories!;
    this.titleResult = 'MENU.FREQUENCY';
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
    this.emitterService.makeFrequency.next(this.fieldRequest);
  }

  public updateVisibilityFlags(): void {
    this.displayResultPanel = !!this.titleResult;
  }

  public displayOptionsPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.optionsPanelSubject;
  }

  public displayMetadataPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.metadataPanelSubject;
  }

  public clearContextFields(): void {
    this.contextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();
  }

  public setTitleResult(title: any): void {
    this.titleResult = title;
  }

  private init(): void {
    const inst = localStorage.getItem(INSTALLATION);
    this.selectedCorpus = !!localStorage.getItem('selectedCorpus') ? JSON.parse(localStorage.getItem('selectedCorpus')!) : null;
    this.simple = localStorage.getItem('simpleQuery')!;
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
      this.corpusList.sort((c1, c2) => c1.value.toLocaleLowerCase().localeCompare(c2.value.toLocaleLowerCase()));
    }

    this.displayQueryType = false;
    this.hideQueryTypeAndContext();

    this.translateService.stream(SELECT_CORPUS_LABEL).subscribe({
      next: (res: any) => this.selectCorpus = res
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

  private closeWebSocket(): void {
    this.socketService.closeSocket();
  }

  private hideQueryTypeAndContext(): void {
    this.displayContext = false;
    this.displayQueryType = false;
  }

}
