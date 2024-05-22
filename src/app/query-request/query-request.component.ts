import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { v4 as uuid } from 'uuid';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CHARACTER, CQL, IMPLICIT, LEMMA, PHRASE, REQUEST_TYPE, SIMPLE, WORD } from '../common/query-constants';
import { QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { INSTALLATION } from '../model/constants';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { Corpus } from '../model/corpus';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { AppInitializerService } from '../services/app-initializer.service';
import { DisplayPanelService } from '../services/display-panel.service';
import { ErrorMessagesService } from '../services/error-messages.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { SocketService } from '../services/socket.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';
import { CorpusSelectionService } from '../services/corpus-selection.service';
import { Observable, Subscription } from 'rxjs';
import { QueryRequest } from '../model/query-request';
import { Metadatum } from '../model/metadatum';

const DEFAULT_SELECTED_QUERY_TYPE = SIMPLE;

@Component({
  selector: 'app-query-request',
  templateUrl: './query-request.component.html',
  styleUrls: ['./query-request.component.scss']
})
export class QueryRequestComponent implements OnInit, OnDestroy {

  @Output() titleResultChange = new EventEmitter<string>();
  @Output() selectedCorpusChange = new EventEmitter<KeyValueItem>();
  @Output() metadataAttributesChange = new EventEmitter<Array<KeyValueItem>>();
  @Output() textTypesAttributesChange = new EventEmitter<Array<KeyValueItem>>();

  public corpusList: KeyValueItem[] = [];
  public selectCorpus = SELECT_CORPUS_LABEL;

  public selectedQueryType: string | null = null;
  public displayContext = false;
  public displayQueryType = false;
  public queryTypes: Array<string> = [];
  public lemma = '';
  public DEFAULT_SELECTED_QUERY_TYPE = DEFAULT_SELECTED_QUERY_TYPE;
  public SIMPLE = SIMPLE;
  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;
  public IMPLICIT = IMPLICIT;
  public isImpaqtsCustom = false;
  public queryTypeLabel = 'PAGE.CONCORDANCE.QUERY_TYPE';

  public queryRequestForm = new UntypedFormGroup({
    selectedCorpus: new UntypedFormControl(null),
    selectedQueryType: new UntypedFormControl(DEFAULT_SELECTED_QUERY_TYPE),
    lemma: new UntypedFormControl(''),
    simple: new UntypedFormControl({ value: '', disabled: true }),
    phrase: new UntypedFormControl(''),
    word: new UntypedFormControl(''),
    character: new UntypedFormControl(''),
    cql: new UntypedFormControl(''),
    implicit: new UntypedFormControl(''),
    matchCase: new UntypedFormControl(false)
  });
  public selectedCorpus: KeyValueItem | null = null;

  private holdSelectedCorpusStr = '';
  private installation?: Installation;
  private textTypeStatus = false;
  private corpusSelectedSubscription?: Subscription;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    public readonly displayPanelService: DisplayPanelService,
    public readonly emitterService: EmitterService,
    private readonly socketService: SocketService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly appInitializerService: AppInitializerService,
    private readonly corpusSelectionService: CorpusSelectionService,
  ) { 
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
  }

  ngOnInit(): void {
    this.hideQueryTypeAndContext();
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(`${corpus.id}`, corpus.name)));
      this.corpusList.sort((c1, c2) => c1.value.toLocaleLowerCase().localeCompare(c2.value.toLocaleLowerCase()));
    }
    this.queryTypes = [
      DEFAULT_SELECTED_QUERY_TYPE,
      LEMMA,
      WORD,
      PHRASE,
      CHARACTER,
      CQL,
      IMPLICIT
    ];
    this.setBasicFieldRequest();
    this.queryRequestForm.valueChanges.subscribe(change => {
      this.setBasicFieldRequest();
    });
    this.selectedQueryType = this.queryTypes[0];
    const lsSimpleQuery = localStorage.getItem('simpleQuery');
    if (lsSimpleQuery) {
      this.queryRequestForm.controls.simple.setValue(lsSimpleQuery);
    }
    this.corpusSelectedSubscription = this.corpusSelectionService.corpusSelectedSubject.subscribe(selectedCorpus => {
      this.corpusSelected(selectedCorpus!);
      this.selectedCorpus = selectedCorpus;
      this.setBasicFieldRequest();
    });
    if (this.corpusSelectionService.getSelectedCorpus()) {
      this.selectedCorpus = this.corpusSelectionService.getSelectedCorpus();
      this.queryRequestForm.controls.simple.enable();
      this.corpusSelected(this.selectedCorpus!);
    }
    if (this.isImpaqtsCustom) {
      this.queryTypeLabel = 'PAGE.CONCORDANCE.SEARCH_FOR';
      this.displayQueryType = true;
    }
  }

  ngOnDestroy(): void {
    if (this.corpusSelectedSubscription) {
      this.corpusSelectedSubscription.unsubscribe();
    }
  }

  public corpusSelected(selectedCorpus: KeyValueItem | undefined): void {
    this.titleResultChange.emit('');
    this.clickTextType();
    this.displayPanelService.closePanel();
    this.queryRequestService.resetOptionsRequest();
    if (selectedCorpus) {
      this.metadataQueryService.clearViewOptionAttributesInLocalstorage();
      this.toggleSimpleDisabling(selectedCorpus);
      const selectedCorpusId = selectedCorpus.key;
      if (this.corpusSelectionService.getCorpusChanged()) {
        this.emitterService.spinnerMetadata.emit(true);
      }
      const metadataAttributes: Array<KeyValueItem> = [];
      const textTypesAttributes: Array<KeyValueItem> = [];
      if (this.installation && this.installation.corpora) {
        if (selectedCorpusId) {
          const corpus: Corpus = this.installation.corpora.filter(corpus => corpus.id === +selectedCorpusId)[0];
          this.socketService.setServerHost(corpus.name);
          corpus.metadata.sort((a, b) => a.position - b.position);
          corpus.metadata.filter(md => !md.child).forEach(md => {
            // Attributes in View Options
            if (!md.documentMetadatum) {
              metadataAttributes.push(new KeyValueItem(md.name, md.name));
            } else {
              textTypesAttributes.push(new KeyValueItem(md.name, md.name));
            }
          });
          this.metadataQueryService.setMetadataAttribute(corpus.metadata);
        }
      }
      this.textTypesAttributesChange.emit(textTypesAttributes);
      this.metadataAttributesChange.emit(metadataAttributes);
      if (selectedCorpusId !== this.holdSelectedCorpusStr) {
        if (this.installation) {
          this.appInitializerService.loadCorpus(+selectedCorpusId).subscribe(corpus => {
            this.setCorpus(corpus, this.corpusSelectionService.getCorpusChanged());
          });
        }
        this.holdSelectedCorpusStr = selectedCorpus.key;
      } else {
        this.displayPanelService.labelMetadataSubject.next(!!selectedCorpus && !!this.textTypeStatus);
        this.emitterService.spinnerMetadata.emit(false);
      }
    } else {
      this.closeWebSocket();
      this.menuEmitterService.corpusSelected = false;
      this.queryRequestForm.controls.simple.setValue('');
      this.hideQueryTypeAndContext();
    }
    this.menuEmitterService.menuEvent$.next(new MenuEvent(QUERY));
    this.selectedCorpusChange.emit(selectedCorpus);
  }


  public makeConcordances(): void {
    if (this.queryRequestForm.controls.simple && this.queryRequestForm.controls.simple.value) {
      localStorage.setItem('simpleQuery', this.queryRequestForm.controls.simple.value);
    } else {
      localStorage.removeItem('simpleQuery');
    }
    this.queryRequestService.resetOptionsRequest();
    this.queryRequestService.resetQueryPattern();
    let typeSearch = ['Query'];
    this.titleResultChange.emit('MENU.CONCORDANCE');
    this.queryRequestService.getQueryRequest().id = uuid();

    // concordance Context
    const fieldRequest = this.trimInputFieldRequest(this.queryRequestService.getBasicFieldRequest());
    const queryRequest = this.trimInputQueryRequest(this.queryRequestService.getQueryRequest());

    if (fieldRequest) {
      fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequest();
      this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.TEXTUAL_QUERY_REQUEST;
      if (fieldRequest.contextConcordance && fieldRequest.contextConcordance.items
        && fieldRequest.contextConcordance.items.length > 0 && fieldRequest.contextConcordance.items[0].term) {
        //nelle query di contesto si invia un solo elemento
        this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
        const ccqr = new ContextConcordanceQueryRequest();
        fieldRequest.contextConcordance.items.forEach(i => i.attribute = LEMMA);
        ccqr.items = fieldRequest.contextConcordance.items.filter(i => i.term);
        this.queryRequestService.getQueryRequest().contextConcordanceQueryRequest = ccqr;
      }
      if (this.queryRequestForm.controls.selectedQueryType.value === IMPLICIT) {
        this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.IMPLICIT_REQUEST;
        //TODO cql from implicit add search in comment 
        fieldRequest.cql = '<impl/>';
        this.queryRequestService.getQueryRequest().cql = '<impl/>';
      }
      if (queryRequest.sortQueryRequest && queryRequest.sortQueryRequest !== undefined) {
        typeSearch = ['Sort', !!queryRequest.sortQueryRequest.sortKey ? queryRequest.sortQueryRequest.sortKey : 'MULTILEVEL_CONTEXT'];
      }
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload([new ConcordanceRequest(fieldRequest, typeSearch)], 0));
    }
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
    this.queryRequestForm.controls.simple.reset();
    this.queryRequestForm.controls.lemma.reset();
    this.queryRequestForm.controls.phrase.reset();
    this.queryRequestForm.controls.word.reset();
    this.queryRequestForm.controls.character.reset();
    this.queryRequestForm.controls.cql.reset();
    this.queryRequestForm.controls.implicit.reset();
    this.queryRequestService.clearContextConcordanceQueryRequest();
  }

  public resetInputs(): void {
    this.clearContextFields();
  }

  private setCorpus(corpus: Corpus, corpusChanged: boolean): void {
    if (corpusChanged || this.corpusSelectionService.getPageLoadedFirstTime()) {
      const installation = this.installation;
      if (installation) {
        installation.corpora.forEach((c, index) => {
          if (c.id === corpus.id) {
            installation.corpora[index] = corpus;
          }
        });
        this.metadataQueryService.clearMetadata();
        const metadataTreeObs: Observable<Metadatum[]>[] = [];
        this.metadataUtilService.createMatadataTree(`${corpus.id}`, installation, false).subscribe(
          {
            next: metadata => this.metadataQueryService.setMetadata(metadata),
            error: err => {
              console.error(err);
              this.displayPanelService.labelMetadataSubject.next(!!this.textTypeStatus);
              this.emitterService.spinnerMetadata.emit(false);
              const metadataErrorMsg = {} as Message;
              metadataErrorMsg.severity = 'error';
              metadataErrorMsg.detail = 'Impossibile recuperare i metadati';
              metadataErrorMsg.summary = 'Errore';
              this.errorMessagesService.sendError(metadataErrorMsg);
            },
            complete: () => {
              this.metadataQueryService.storageMetadata();
              this.displayPanelService.labelMetadataSubject.next(!!this.textTypeStatus);
              this.emitterService.spinnerMetadata.emit(false);
              this.corpusSelectionService.resetCorpusChanged();
            }
          });
      } else {
        this.metadataQueryService.resetMetadataService();
      }
    }
    this.corpusSelectionService.setPageLoadedFirstTime(false);
  }

  private closeWebSocket(): void {
    this.socketService.closeSocket();
  }

  private hideQueryTypeAndContext(): void {
    this.displayContext = false;
    this.displayQueryType = false;
  }

  private setBasicFieldRequest(): void {
    const fieldRequest = FieldRequest.build(
      this.selectedCorpus,
      '',
      this.queryRequestForm.controls.simple.value,
      this.queryRequestForm.controls.lemma.value,
      this.queryRequestForm.controls.phrase.value,
      this.queryRequestForm.controls.word.value,
      this.queryRequestForm.controls.character.value,
      this.queryRequestForm.controls.cql.value,
      this.queryRequestForm.controls.implicit.value,
      this.queryRequestForm.controls.matchCase.value,
      this.queryRequestForm.controls.selectedQueryType.value);
    this.queryRequestService.setBasicFieldRequest(fieldRequest);
  }

  private toggleSimpleDisabling(newSelectedCorpus: KeyValueItem): void {
    const disabled = !newSelectedCorpus;
    if (disabled) {
      this.queryRequestForm.get('simple')?.disable();
    } else {
      this.queryRequestForm.get('simple')?.enable();
    }
  }

  private trimInputFieldRequest(fieldRequest: FieldRequest | null): FieldRequest | null {
    if (fieldRequest) {
      fieldRequest.simple = fieldRequest.simple ? fieldRequest.simple.trim() : '';
      fieldRequest.lemma = fieldRequest.lemma ? fieldRequest.lemma.trim() : '';
      fieldRequest.phrase = fieldRequest.phrase ? fieldRequest.phrase.trim() : '';
      fieldRequest.word = fieldRequest.word ? fieldRequest.word.trim() : '';
      fieldRequest.character = fieldRequest.character ? fieldRequest.character.trim() : '';
      fieldRequest.cql = fieldRequest.cql ? fieldRequest.cql.trim() : '';
    }
    return fieldRequest;
  }

  private trimInputQueryRequest(queryRequest: QueryRequest): QueryRequest {
    if (queryRequest) {
      queryRequest.corpusMetadatum = queryRequest.corpusMetadatum.trim();
      queryRequest.word = queryRequest.word.trim();
      queryRequest.corpus = queryRequest.corpus.trim();
      queryRequest.cql = queryRequest.cql.trim();
    }
    return queryRequest;
  }

}
