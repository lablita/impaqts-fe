import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyValueItem } from '../model/key-value-item';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class EmitterService {
  public clickLabel: EventEmitter<KeyValueItem> = new EventEmitter<KeyValueItem>();
  public clickLabelOptionsDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  public clickLabelMetadataDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  public clickPanelDisplayOptions: EventEmitter<boolean> = new EventEmitter<boolean>();
  public clickPanelDisplayMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public spinnerMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public user: BehaviorSubject<User> = new BehaviorSubject(new User());
  public pageMenu = '';

}
