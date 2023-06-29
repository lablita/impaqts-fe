import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WS, WSS, WS_URL } from '../common/constants';
import { QueryRequest } from '../model/query-request';
import { ErrorMessagesService } from './error-messages.service';
import { RxWebsocketSubject } from './rx-websocket-subject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private serverHost = '';
  private wsEndpoint = '';
  private socketSubject: RxWebsocketSubject | null = null;

  constructor(
    private readonly errorMessageService: ErrorMessagesService,
    private readonly authService: AuthService
  ) {

  }

  public sendMessage(message: QueryRequest): void {
    if (this.socketSubject) {
      this.socketSubject.send(message);
    }
  }

  public connect(): void {
    this.socketSubject = new RxWebsocketSubject(this.wsEndpoint, this.errorMessageService);
  }

  public getSocketSubject(): RxWebsocketSubject | null {
    if (this.socketSubject) {
      return this.socketSubject;
    }
    return null;
  }

  public setServerHost(serverHost: string): void {
    this.serverHost = serverHost;
    let endpoint = '';
    if (environment.production) {
      endpoint = `${this.serverHost}/${WS_URL}`;
      endpoint = environment.secureUrl ? WSS + endpoint : WS + endpoint;
    } else {
      endpoint = `${this.serverHost}/${WS_URL}`;
      endpoint = environment.secureUrl ? WSS + 'localhost:4200' + endpoint : WS + 'localhost:4200' + endpoint;
    }
    this.authService.getAccessTokenSilently().subscribe({
      next: accessToken => this.wsEndpoint = `${endpoint}?accessToken=${accessToken}`
    });
  }

  public closeSocket(): void {
    this.socketSubject?.close();
  }

}

