import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldRequest } from '../model/field-request';
import { User } from '../model/user';
import { ConcordanceRequest } from '../queries-container/queries-container.component';

@Injectable({
  providedIn: 'root'
})

export class EmitterService {
  public spinnerMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public makeConcordance: BehaviorSubject<ConcordanceRequest> =
    new BehaviorSubject<ConcordanceRequest>(new ConcordanceRequest(new FieldRequest(), []));
  public makeCollocation: BehaviorSubject<FieldRequest> = new BehaviorSubject<FieldRequest>(new FieldRequest());
  public makeFrequency: BehaviorSubject<FieldRequest> = new BehaviorSubject<FieldRequest>(new FieldRequest());
  public pageMenu = '';

}
