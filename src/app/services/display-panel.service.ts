import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayPanelService {

  public displayPanelOptions: boolean = false;
  public displayPanelMetadata: boolean = false;

  constructor() { }
}
