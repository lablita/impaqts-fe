import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WS_URL } from '../common/constants';
import { QueryRequest } from '../model/query-request';
import { ErrorMessagesService } from './error-messages.service';
import { RxWebsocketSubject } from './rx-websocket-subject';

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
    this.wsEndpoint = `${this.serverHost}/${WS_URL}`;
    this.authService.getAccessTokenSilently().subscribe({
      next: accessToken => this.wsEndpoint = `${this.wsEndpoint}?accessToken=${accessToken}`
    });
  }

  public closeSocket(): void {
    this.socketSubject?.close();
  }

}

