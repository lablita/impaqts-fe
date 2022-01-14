import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class EmitterService {
  public labelOptionsDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  public labelMetadataDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  public panelDisplayOptions: EventEmitter<boolean> = new EventEmitter<boolean>();
  public panelDisplayMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public spinnerMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public pageMenu = '';

}
