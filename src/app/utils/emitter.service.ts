import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {

  public clickLabel: EventEmitter<string> = new EventEmitter<string>();
  public clickLabelOptionsDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  public clickLabelMetadataDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  public clickPanelDisplayOptions: EventEmitter<boolean> = new EventEmitter<boolean>();
  public clickPanelDisplayMetadata: EventEmitter<boolean> = new EventEmitter<boolean>();
  public spinnerMetadata?: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
}
