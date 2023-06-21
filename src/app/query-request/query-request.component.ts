import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { v4 as uuid } from 'uuid';
import { WS, WSS } from '../common/constants';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CHARACTER, CQL, LEMMA, PHRASE, REQUEST_TYPE, SIMPLE, WORD } from '../common/query-constants';
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

const DEFAULT_SELECTED_QUERY_TYPE = SIMPLE;

@Component({
  selector: 'app-query-request',
  templateUrl: './query-request.component.html',
  styleUrls: ['./query-request.component.scss']
})
export class QueryRequestComponent implements OnInit {

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

  public queryRequestForm = new UntypedFormGroup({
    selectedCorpus: new UntypedFormControl(null),
    selectedQueryType: new UntypedFormControl(DEFAULT_SELECTED_QUERY_TYPE),
    lemma: new UntypedFormControl(''),
    simple: new UntypedFormControl({ value: '', disabled: true }),
    phrase: new UntypedFormControl(''),
    word: new UntypedFormControl(''),
    character: new UntypedFormControl(''),
    cql: new UntypedFormControl(''),
    matchCase: new UntypedFormControl(false)
  });


  private holdSelectedCorpusStr = '';
  private installation?: Installation;
  private textTypeStatus = false;

  constructor(
    private readonly queryRequestService: QueryRequestService,
    public readonly displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly socketService: SocketService,
    private readonly metadataUtilService: MetadataUtilService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly appInitializerService: AppInitializerService
  ) { }

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
      CQL
    ];
    this.setBasicFieldRequest();
    this.queryRequestForm.valueChanges.subscribe(change => {
      this.setBasicFieldRequest();
    });
    if (this.queryRequestForm) {
      this.queryRequestForm.controls.selectedCorpus.valueChanges.subscribe(change => this.toggleSimpleDisabling(change));
    }
    this.selectedQueryType = this.queryTypes[0];
    if (!!localStorage.getItem('selectedCorpus')) {
      const lsSelectedCorpus = localStorage.getItem('selectedCorpus');
      if (lsSelectedCorpus) {
        this.queryRequestForm.controls.selectedCorpus.setValue(JSON.parse(lsSelectedCorpus));
      }
      const lsSimpleQuery = localStorage.getItem('simpleQuery');
      if (lsSimpleQuery) {
        this.queryRequestForm.controls.simple.setValue(lsSimpleQuery);
      }
      this.corpusSelect();
    }
  }

  public corpusSelect(): void {
    this.titleResultChange.emit('');
    this.clickTextType();
    this.displayPanelService.reset();
    this.queryRequestService.resetOptionsRequest();
    const selectedCorpus = this.queryRequestForm.controls.selectedCorpus.value;
    localStorage.setItem('selectedCorpus', JSON.stringify(this.queryRequestForm.controls.selectedCorpus.value));
    if (selectedCorpus) {
      const selectedCorpusId = selectedCorpus.key;
      this.emitterService.spinnerMetadata.emit(true);
      const metadataAttributes: Array<KeyValueItem> = [];
      const textTypesAttributes: Array<KeyValueItem> = [];
      if (this.installation && this.installation.corpora) {
        if (selectedCorpusId) {
          const corpus: Corpus = this.installation.corpora.filter(corpus => corpus.id === +selectedCorpusId)[0];
          const endpoint = environment.secureUrl ? WSS + corpus.endpoint : WS + corpus.endpoint;
          this.socketService.setServerHost(endpoint);
          corpus.metadata.sort((a, b) => a.position - b.position);
          corpus.metadata.filter(md => !md.child).forEach(md => {
            // Attributes in View Options
            if (!md.documentMetadatum) {
              metadataAttributes.push(new KeyValueItem(md.name, md.name));
            } else {
              textTypesAttributes.push(new KeyValueItem(md.name, md.name));
            }
          });
        }
      }
      this.textTypesAttributesChange.emit(textTypesAttributes);
      this.metadataAttributesChange.emit(metadataAttributes);
      if (selectedCorpusId !== this.holdSelectedCorpusStr) {
        if (this.installation) {
          this.appInitializerService.loadCorpus(+selectedCorpusId).subscribe(corpus => {
            this.setCorpus(corpus);
          });
        }
        this.holdSelectedCorpusStr = this.queryRequestForm.controls.selectedCorpus.value.key;
      } else {
        this.displayPanelService.labelMetadataSubject.next(!!this.queryRequestForm.controls.selectedCorpus.value && !!this.textTypeStatus);
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
    localStorage.setItem('selectedCorpus', JSON.stringify(this.queryRequestForm.controls.selectedCorpus.value));
    localStorage.setItem('simpleQuery', this.queryRequestForm.controls.simple.value);
    this.queryRequestService.resetOptionsRequest();
    this.queryRequestService.resetQueryPattern();
    let typeSearch = ['Query'];
    this.titleResultChange.emit('MENU.CONCORDANCE');
    this.queryRequestService.getQueryRequest().id = uuid();

    // concordance Context
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    const queryRequest = this.queryRequestService.getQueryRequest();
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
    this.queryRequestService.clearContextConcordanceQueryRequest();
  }

  private setCorpus(corpus: Corpus): void {
    this.metadataQueryService.clearMetadata();
    const installation = this.installation;
    if (installation) {
      installation.corpora.forEach((c, index) => {
        if (c.id === corpus.id) {
          installation.corpora[index] = corpus;
        }
      });
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
            this.displayPanelService.labelMetadataSubject.next(!!this.textTypeStatus);
            this.emitterService.spinnerMetadata.emit(false);
          }
        });
    }

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
      this.queryRequestForm.controls.selectedCorpus.value,
      '',
      this.queryRequestForm.controls.simple.value,
      this.queryRequestForm.controls.lemma.value,
      this.queryRequestForm.controls.phrase.value,
      this.queryRequestForm.controls.word.value,
      this.queryRequestForm.controls.character.value,
      this.queryRequestForm.controls.cql.value,
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
}
