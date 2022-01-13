import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuEvent } from './menu.component';

@Injectable({
  providedIn: 'root'
})
export class MenuEmitterService {
  public corpusSelected = false;
  public menuEvent$: Subject<MenuEvent> = new Subject<MenuEvent>();

}
