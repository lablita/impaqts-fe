import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldRequest } from '../model/field-request';
import { QueryPattern } from '../model/query-pattern';
import { User } from '../model/user';
import { ConcordanceRequest } from '../queries-container/queries-container.component';

export class ConcordanceRequestPayLoad {
  concordances: Array<ConcordanceRequest> = Array.from<ConcordanceRequest>({ length: 0 });
  pos = 0;
  qp: QueryPattern | null = null;

  constructor(concordances: Array<ConcordanceRequest>, pos: number, qp: QueryPattern | null) {
    this.concordances = concordances;
    this.pos = 0;
    this.qp = qp;
  }
}

@Injectable({
  providedIn: 'root'
})

export class EmitterService {
  public spinnerMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public makeConcordance: BehaviorSubject<ConcordanceRequestPayLoad> =
    new BehaviorSubject<ConcordanceRequestPayLoad>(new ConcordanceRequestPayLoad([], 0, null));
  public makeCollocation: BehaviorSubject<FieldRequest> = new BehaviorSubject<FieldRequest>(new FieldRequest());
  public makeFrequency: BehaviorSubject<FieldRequest> = new BehaviorSubject<FieldRequest>(new FieldRequest());
  public pageMenu = '';

}
