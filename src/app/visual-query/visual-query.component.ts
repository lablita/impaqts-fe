import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryToken } from '../model/query-token';

const WS_URL = '/test-query-ws-ext';
@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss']
})

export class VisualQueryComponent implements OnInit {

  public queryPattern: QueryPattern = new QueryPattern();
  public typeListQuery: KeyValueItem[] = [new KeyValueItem('1', 'uno'), new KeyValueItem('2', 'due'), new KeyValueItem('3', 'tre')];
  public optionList: KeyValueItem[] = [new KeyValueItem('1', 'repeat'), new KeyValueItem('2', 'sentence start'), new KeyValueItem('3', 'sentence end')];

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

  private websocket: WebSocketSubject<any>;
  private simple: string;

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));

    /** Web Socket */
    const url = `ws://localhost:9000${WS_URL}`;
    this.websocket = webSocket(url);
    this.websocket.asObservable().subscribe(
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
    // this.loading = true;
    const qr = new QueryRequest();
    qr.queryPattern = this.queryPattern;
    if (!event) {
      qr.start = 0;
      qr.end = 10;
    } else {
      qr.start = event.first;
      qr.end = qr.start + event.rows;
    }
    // qr.word = `[word="${this.simple}"]`;
    // qr.corpus = this.selectedCorpus.key;
    this.websocket.next(qr);
    // this.menuEmitterService.click.emit(new MenuEvent(RESULT_CONCORDANCE));
  }

}
