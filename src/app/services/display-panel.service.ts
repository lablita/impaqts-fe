import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayPanelService {
  public displayPanelOptions = false;
  public displayPanelMetadata = false;
  public labelOptionsDisabled = true;
  public labelMetadataDisabled = true;
  public panelItemSelected: string | null = null;
  // public panelDisplaySubject: Subject<boolean> = new Subject();

  public reset(): void {
    this.displayPanelMetadata = false;
    this.displayPanelOptions = false;
    this.labelMetadataDisabled = true;
    this.labelOptionsDisabled = true;
  }
}
