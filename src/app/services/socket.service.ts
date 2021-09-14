import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WS_URL } from '../common/constants';
import { QueryRequest } from '../model/query-request';
import { RxWebsocketSubject } from './rx-websocket-subject';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private readonly WS_ENDPOINT = `${environment.queryServerProtocol}://${environment.queryServerHost}/${WS_URL}`;
  private socketSubject: RxWebsocketSubject;

  public connect(): void {
    this.socketSubject = new RxWebsocketSubject(this.WS_ENDPOINT);
  }

  public sendMessage(message: QueryRequest): void {
    this.socketSubject.send(message);
  }

  public getSocketSubject(): RxWebsocketSubject {
    return this.socketSubject;
  }
}
