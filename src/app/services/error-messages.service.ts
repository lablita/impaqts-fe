import { Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {

  private readonly errorMessages$: Subject<Message> = new Subject<Message>();

  constructor(private readonly messageService: MessageService,) {
    this.errorMessages$.pipe(
      debounceTime(200)
    ).subscribe(msg => this.messageService.add(msg));
  }

  public sendError(msg: Message): void {
    this.errorMessages$.next(msg);
  }

}
