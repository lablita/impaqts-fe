import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class EmitterService {
  public spinnerMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public makeConconrdance: EventEmitter<any> = new EventEmitter<any>();
  public makeCollocation: EventEmitter<any> = new EventEmitter<any>();
  public pageMenu = '';

}
