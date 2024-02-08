import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WS } from '../common/constants';
import { QueryRequest } from '../model/query-request';
import { ErrorMessagesService } from './error-messages.service';
import { RxWebsocketSubject } from './rx-websocket-subject';
import { QueryRequestService } from './query-request.service';
import { InstallationService } from './installation.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private wsEndpoint = '';
  private socketSubject: RxWebsocketSubject | null = null;

  constructor(
    public readonly queryRequestService: QueryRequestService,
    private readonly errorMessageService: ErrorMessagesService,
    private readonly authService: AuthService,
    private readonly installationServices: InstallationService
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

  public setServerHost(corpus: string): void {
    const endpoint = this.installationServices.getCompleteEndpoint(corpus, WS);
    this.wsEndpoint = `${endpoint}`;
    this.authService.getAccessTokenSilently().subscribe({
      next: accessToken => this.wsEndpoint += `?accessToken=${accessToken}`
    });
  }

  public closeSocket(): void {
    this.socketSubject?.close();
  }

}

