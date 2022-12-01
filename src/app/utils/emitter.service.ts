import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldRequest } from '../model/field-request';
import { User } from '../model/user';
import { ConcordanceRequest } from '../queries-container/queries-container.component';

export class ConcordanceRequestPayload {
  concordances: Array<ConcordanceRequest> = [];
  pos = 0;

  constructor(concordances: Array<ConcordanceRequest>, pos: number) {
    this.concordances = concordances;
    this.pos = 0;
  }
}

@Injectable({
  providedIn: 'root'
})

export class EmitterService {
  public spinnerMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public makeConcordanceRequestSubject: BehaviorSubject<ConcordanceRequestPayload> =
    new BehaviorSubject<ConcordanceRequestPayload>(new ConcordanceRequestPayload([], 0));
  public makeCollocation: BehaviorSubject<FieldRequest> = new BehaviorSubject<FieldRequest>(new FieldRequest());
  public makeFrequency: BehaviorSubject<FieldRequest> = new BehaviorSubject<FieldRequest>(new FieldRequest());
  public pageMenu = '';

}
