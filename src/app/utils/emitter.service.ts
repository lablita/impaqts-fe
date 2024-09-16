import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FieldRequest } from '../model/field-request';
import { User } from '../model/user';
import { ConcordanceRequest } from '../queries-container/queries-container.component';

export class ConcordanceRequestPayload {
  concordances: Array<ConcordanceRequest> = [];
  pos = 0;
  queryFromSortPanel = false;

  constructor(concordances: Array<ConcordanceRequest>, pos: number) {
    this.concordances = concordances;
    this.pos = 0;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EmitterService {
  public spinnerMetadata: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public makeConcordanceRequestSubject: BehaviorSubject<ConcordanceRequestPayload> =
    new BehaviorSubject<ConcordanceRequestPayload>(
      new ConcordanceRequestPayload([], 0)
    );
  public makeCollocation: BehaviorSubject<FieldRequest> =
    new BehaviorSubject<FieldRequest>(new FieldRequest());
  public makeFrequency: BehaviorSubject<FieldRequest> =
    new BehaviorSubject<FieldRequest>(new FieldRequest());
  public pageMenu = '';
  public localStorageSubject: Subject<void> = new Subject();
  public elaborationSubject: BehaviorSubject<string> = new BehaviorSubject('');
  public freqAndCollDisablingSubject: Subject<boolean> = new Subject();
}
