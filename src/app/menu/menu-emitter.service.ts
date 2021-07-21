import { EventEmitter, Injectable } from '@angular/core';
import { MenuEvent } from './menu.component';

@Injectable({
  providedIn: 'root'
})
export class MenuEmitterService {
  public corpusSelected: boolean;
  public click: EventEmitter<MenuEvent> = new EventEmitter<MenuEvent>();

  constructor() { }
}
