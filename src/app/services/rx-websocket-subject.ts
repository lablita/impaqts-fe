import { interval, Observable, Observer, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, share, takeWhile } from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

/// we inherit from the ordinary Subject
export class RxWebsocketSubject extends Subject<any> {

  public connectionStatus: Observable<any>;

  private reconnectionObservable: Observable<any> | null = null;
  private readonly wsSubjectConfig: WebSocketSubjectConfig<any>;
  private socket: WebSocketSubject<any> | null = null;
  private connectionObserver: Observer<any> | null = null;

  private reconnectionSubscription: Subscription | null = null;

  /// by default, when a message is received from the server, we are trying to decode it as JSON
  /// we can override it in the constructor
  defaultResultSelector = (e: MessageEvent) => {
    return JSON.parse(e.data);
  }

  /// when sending a message, we encode it to JSON
  /// we can override it in the constructor
  defaultSerializer = (data: any): string => {
    return JSON.stringify(data);
  }

  constructor(
    private readonly url: string,
    private readonly reconnectInterval: number = 5000,  /// pause between connections
    private readonly reconnectAttempts: number = 10,  /// number of connection attempts
    private readonly resultSelector?: (e: MessageEvent) => any,
    private readonly serializer?: (data: any) => string,
  ) {
    super();
    /// connection status
    this.connectionStatus = new Observable((observer) => {
      this.connectionObserver = observer;
    }).pipe(share(), distinctUntilChanged());

    if (!resultSelector) {
      this.resultSelector = this.defaultResultSelector;
    }
    if (!this.serializer) {
      this.serializer = this.defaultSerializer;
    }

    /// config for WebSocketSubject
    /// except the url, here is closeObserver and openObserver to update connection status
    this.wsSubjectConfig = {
      url,
      closeObserver: {
        next: (e: CloseEvent) => {
          this.socket = null;
          if (this.connectionObserver) {
            this.connectionObserver.next(false);
          }
        }
      },
      openObserver: {
        next: (e: Event) => {
          if (this.connectionObserver) {
            this.connectionObserver.next(true);
          }
        }
      }
    };
    /// we connect
    this.connect();
    /// we follow the connection status and run the reconnect while losing the connection
    this.connectionStatus.subscribe({
      next: isConnected => {
        if (!this.reconnectionObservable && typeof (isConnected) === 'boolean' && !isConnected) {
          this.reconnect();
        }
      }
    });
  }

  connect(): void {
    this.socket = new WebSocketSubject(this.wsSubjectConfig);
    this.socket.subscribe({
      next: m => {
        this.next(m); // when receiving a message, we just send it to our Subject
      },
      error: (error: Event) => {
        if (!this.socket) {
          // in case of an error with a loss of connection, we restore it
          this.socket = null;
          this.reconnect();
        }
      }
    });
  }

  /// WebSocket Reconnect handling
  reconnect(): void {
    if (this.reconnectionSubscription) {
      this.reconnectionSubscription.unsubscribe();
    }
    this.reconnectionObservable = interval(this.reconnectInterval).pipe(
      takeWhile((v, index) => {
        console.log(`WS Reconnection Attempt: ${index}`);
        return index < this.reconnectAttempts && !this.socket;
      }));
    this.reconnectionSubscription = this.reconnectionObservable.subscribe(
      {
        next: () => {
          setTimeout(() => this.connect(), 300);
        },
        complete: () => {
          /// if the reconnection attempts are failed, then we call complete of our Subject and status
          this.reconnectionObservable = null;
          if (!this.socket) {
            this.complete();
            if (this.connectionObserver) {
              this.connectionObserver.complete();
            }
          }
        }
      });
  }

  /// sending the message
  send(data: any): void {
    if (this.socket) {
      this.socket.next(data);
    }
  }

  close(): void {
    if (!!this.socket) {
      this.socket.unsubscribe();
    }
  }
}
