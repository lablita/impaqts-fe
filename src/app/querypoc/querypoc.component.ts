import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { WS_URL } from '../common/constants';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';

@Component({
  selector: 'app-querypoc',
  templateUrl: './querypoc.component.html',
  styleUrls: ['./querypoc.component.scss']
})
export class QuerypocComponent implements OnInit, OnDestroy {

  public queryResponse: QueryResponse | null = null;
  public totalResults = 0;
  public wordFC = new FormControl('');
  private websocket: WebSocketSubject<any> | null = null;

  constructor() { }

  ngOnInit(): void {
    const url = `${environment.queryServerProtocol}://${environment.queryServerHost}/${WS_URL}`;
    this.websocket = webSocket(url);
    this.websocket.asObservable().subscribe(
      resp => {
        const qr = resp as QueryResponse;
        if (qr.kwicLines.length > 0) {
          this.queryResponse = resp as QueryResponse;
        }
        this.totalResults = qr.currentSize;
      },
      err => console.error(err),
      () => console.log('Activiti WS disconnected')
    );
  }

  ngOnDestroy() {
    this.closeWebSocket();
  }

  public search(): void {
    const qr = new QueryRequest();
    qr.start = 0;
    qr.end = 15;
    qr.word = `[word="${this.wordFC.value}"]`;
    if (this.websocket) {
      this.websocket.next(qr);
    }
  }

  private closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.complete();
      this.websocket = null;
    }
  }

}
