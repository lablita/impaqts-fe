import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ConcordanceService } from '../concordance/concordance.service';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/Metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryToken } from '../model/query-token';
import { MetadataUtilService } from '../utils/metadata-util.service';

const TEXT_TYPES_QUERY_REQUEST = 'textTypesQueryRequest';
const WS_URL = '/test-query-ws-ext';
@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss']
})

export class VisualQueryComponent implements OnInit, OnDestroy {

  public queryPattern: QueryPattern = new QueryPattern();
  public typeListQuery: KeyValueItem[] = [new KeyValueItem('word', 'word'), new KeyValueItem('2', 'due'), new KeyValueItem('3', 'tre')];
  public optionList: KeyValueItem[] = [new KeyValueItem('1', 'repeat'), new KeyValueItem('2', 'sentence start'), new KeyValueItem('3', 'sentence end')];

  public metadataTextTypes: Metadatum[];
  public metadata: QueryToken[] = [];
  public typeListMetadata: KeyValueItem[] = [new KeyValueItem('1', 'uno'), new KeyValueItem('2', 'due'), new KeyValueItem('3', 'tre')];

  public installation: Installation;
  public corpusList: KeyValueItem[] = [];
  public selectedCorpus: KeyValueItem;
  public selectCorpus = 'PAGE.CONCORDANCE.SELECT_CORPUS';

  public totalResults = 0;
  public simpleResult: string;
  public kwicLines: KWICline[];
  public TotalKwicline: KWICline[];

  public loading = 0;
  public res: KeyValueItem[] = [];

  private websocketVQ: WebSocketSubject<any>;
  private simple: string;

  constructor(
    private readonly concordanceService: ConcordanceService,
    private readonly metadataUtilService: MetadataUtilService
  ) { }

  ngOnDestroy(): void {
    this.websocketVQ.unsubscribe();
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));

    /** Web Socket */
    const url = `ws://localhost:9000${WS_URL}`;
    this.websocketVQ = webSocket(url);
    this.websocketVQ.asObservable().subscribe(
      resp => {
        const qr = resp as QueryResponse;
        if (qr.kwicLines.length > 0) {
          // this.queryResponse = resp as QueryResponse;
          this.kwicLines = (resp as QueryResponse).kwicLines;
        }
        this.totalResults = qr.currentSize;
        this.simpleResult = this.simple;
        // this.loading = false;
      },
      err => console.error(err),
      () => console.log('Activiti WS disconnected')
    );
  }

  public addTokenQuery(): void {
    const token = new QueryToken();
    this.queryPattern.tokPattern.push(token);
  }

  public deleteTokenQuery(token: QueryToken): void {
    this.queryPattern.tokPattern.splice(this.queryPattern.tokPattern.indexOf(token), 1);
  }

  public addTokenMetadata(): void {
    const token = new QueryToken();
    this.metadata.push(token);
  }

  public deleteTokenMetadata(token: QueryToken): void {
    this.metadata.splice(this.queryPattern.tokPattern.indexOf(token), 1);
  }

  public loadConcordances(event?: LazyLoadEvent): void {
    const qr = new QueryRequest();
    qr.queryPattern = this.queryPattern;
    if (!event) {
      qr.start = 0;
      qr.end = 10;
    } else {
      qr.start = event.first;
      qr.end = qr.start + event.rows;
    }
    qr.corpus = this.selectedCorpus.key;
    this.websocketVQ.next(qr);
  }

  public dropdownCorpus(): void {
    if (this.selectedCorpus) {
      this.metadataTextTypes = this.installation.corpora.filter(corpus => corpus.name === this.selectedCorpus.key)[0].
        metadata.filter(md => md.documentMetadatum);

      this.loading = this.metadataTextTypes.length;

      // recuro i dati salvati nel localstorage
      const textTypesRequest = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST) ?
        JSON.parse(localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)) : null;

      // genero albero per componente multiselect check box
      this.metadataTextTypes.forEach(md => {
        if (md.subMetadata?.length > 0) {
          md.tree = [];
          const res = this.metadataUtilService.generateTree(md, (textTypesRequest?.multiSelects &&
            textTypesRequest.multiSelects.filter(ms => ms.key === md.name).length > 0)
            ? textTypesRequest.multiSelects.filter(ms => ms.key === md.name)[0].values : null);
          md.tree.push(res['tree']);
          md.selection = res['selections'];
        }
      });

      this.metadataTextTypes.forEach((metadatum, index) => {
        this.res.push(new KeyValueItem(metadatum.name, ''));
        if (metadatum.retrieveValuesFromCorpus) {
          metadatum.selected = false;
          setTimeout(() => this.concordanceService.getMetadatumValues(this.selectedCorpus.value, metadatum.name).subscribe(res => {
            //ripristino valori letti da local storage 
            const selectionated = textTypesRequest?.singleSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
              textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name)[0] :
              (textTypesRequest?.multiSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
                textTypesRequest.multiSelects.filter(ss => ss.key === metadatum.name)[0] : null);
            this.loading--;

            metadatum = this.metadataUtilService.mergeMetedata(res, metadatum, selectionated);

            if (this.loading === 0) {
              //collego l'elenco dei metadati recuperato dal corpus e lo collegao al ramo cui spetta
              this.metadataUtilService.linkLeafs(this.metadataTextTypes, textTypesRequest);
              // elimino metadata che partecimano ad alberi 
              this.metadataTextTypes = this.metadataTextTypes.filter(md => !md.child);
            }
          }), 1000 * index);
        } else {
          this.loading--;
        }
      });

      /** recupero freeText da localstorage */
      if (textTypesRequest?.freeTexts) {
        this.metadataTextTypes.forEach(md => {
          if (md?.freeText) {
            md.selection = textTypesRequest.freeTexts.filter(freeT => freeT.key === md.name)[0]?.value;
          }
        });
      }
      //ordinamento position 
      this.metadataTextTypes.sort((a, b) => a.position - b.position);
    }
  }

  public getMetadatumTextTypes(): Metadatum[] {
    return this.metadataTextTypes;
  }


}
