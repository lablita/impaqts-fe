import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { WS, WSS } from '../common/constants';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CHARACTER, CQL, LEMMA, PHRASE, SIMPLE, WORD } from '../common/query-constants';
import { QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { INSTALLATION } from '../model/constants';
import { Corpus } from '../model/corpus';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { SocketService } from '../services/socket.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';

const DEFAULT_SELECTED_QUERY_TYPE = new KeyValueItem(SIMPLE, SIMPLE);

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

  public queryRequestForm = new FormGroup({
    selectedCorpus: new FormControl(null),
    selectedQueryType: new FormControl(DEFAULT_SELECTED_QUERY_TYPE),
    lemma: new FormControl(''),
    simple: new FormControl(''),
    phrase: new FormControl(''),
    word: new FormControl(''),
    character: new FormControl(''),
    cql: new FormControl(''),
    matchCase: new FormControl(false)
  });


  private holdSelectedCorpusStr = '';
  private installation?: Installation;
  private endedMetadataProcess = false;
  private textTypeStatus = false;

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
    this.hideQueryTypeAndContext();
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
      this.corpusList.sort((c1, c2) => c1.value.toLocaleLowerCase().localeCompare(c2.value.toLocaleLowerCase()));
    }
    this.queryTypes = [
      DEFAULT_SELECTED_QUERY_TYPE,
      new KeyValueItem(LEMMA, LEMMA),
      new KeyValueItem(WORD, WORD),
      new KeyValueItem(PHRASE, PHRASE),
      new KeyValueItem(CHARACTER, CHARACTER),
      new KeyValueItem(CQL, CQL)
    ];
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
    this.setBasicFieldRequest();
    this.queryRequestForm.valueChanges.subscribe(change => {
      this.setBasicFieldRequest();
    });
  }

  public corpusSelect(): void {
    this.titleResultChange.emit('');
    this.clickTextType();
    this.displayPanelService.reset();
    this.queryRequestService.resetOptionsRequest();
    const selectedCorpus = this.queryRequestForm.controls.selectedCorpus.value;
    if (selectedCorpus) {
      const selectedCorpusKey = selectedCorpus.key;
      this.emitterService.spinnerMetadata.emit(true);
      const metadataAttributes: Array<KeyValueItem> = [];
      const textTypesAttributes: Array<KeyValueItem> = [];
      if (this.installation && this.installation.corpora) {
        if (selectedCorpusKey) {
          const corpora: Corpus = this.installation.corpora.filter(corpus => corpus.name === selectedCorpusKey)[0];
          const endpoint = environment.secureUrl ? WSS + corpora.endpoint : WS + corpora.endpoint;
          this.socketService.setServerHost(endpoint);
          corpora.metadata.sort((a, b) => a.position - b.position);
          corpora.metadata.filter(md => !md.child).forEach(md => {
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
      if (selectedCorpusKey !== this.holdSelectedCorpusStr) {
        if (this.installation) {
          this.metadataUtilService.createMatadataTree(selectedCorpusKey, this.installation, false).subscribe(
            {
              next: res => {
                this.metadataQueryService.metadata = res.md;
                this.endedMetadataProcess = res.ended;
                if (this.endedMetadataProcess) {
                  this.displayPanelService.labelMetadataSubject.next(!!this.textTypeStatus);
                  // ordinamento position
                  this.metadataQueryService.metadata.sort((a, b) => a.position - b.position);
                  this.emitterService.spinnerMetadata.emit(false);
                }
              }
            });
        }
        this.holdSelectedCorpusStr = this.queryRequestForm.controls.selectedCorpus.value.key;
      } else {
        this.displayPanelService.labelMetadataSubject.next(!!this.queryRequestForm.controls.selectedCorpus.value && !!this.textTypeStatus);
        this.emitterService.spinnerMetadata.emit(false);
        this.endedMetadataProcess = true;
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
    let typeSearch = ['Query'];
    this.titleResultChange.emit('MENU.CONCORDANCE');

    // concordance Context
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (fieldRequest) {
      fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequestDTO();
      if (this.queryRequestService.queryRequest.sortQueryRequest
        && this.queryRequestService.queryRequest.sortQueryRequest !== undefined) {
        typeSearch = ['Sort', !!this.queryRequestService.queryRequest.sortQueryRequest.sortKey
          ? this.queryRequestService.queryRequest.sortQueryRequest.sortKey : 'MULTILEVEL_CONTEXT'];
      }
      this.emitterService.makeConcordance.next(new ConcordanceRequestPayload([new ConcordanceRequest(fieldRequest, typeSearch)], 0, null));
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
    this.queryRequestService.clearContextConcordanceQueryRequestDTO();
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
}
