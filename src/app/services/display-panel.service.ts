import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { QUERY } from '../common/routes-constants';

@Injectable({
  providedIn: 'root'
})
export class DisplayPanelService {
  public displayPanelOptions = false;
  public labelOptionsDisabled = true;
  public labelMetadataDisabled = true;
  public panelItemSelected: string | null = null;



  // signals for page events
  public metadataPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelOptionsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public optionsPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public displayPanelMetadataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public menuChangedSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(QUERY);
  public menuClickedSubject: Subject<void> = new Subject<void>();

  // signals from page events
  public metadataButtonSubject: Subject<void> = new Subject();
  public optionsButtonSubject: Subject<void> = new Subject();
  public menuItemClickSubject: Subject<string> = new Subject();

  private metadataButtonStatus = false;
  private optionsButtonStatus = false;
  private metadataPanelStatus = false;
  private lastClickedMenuItem: string | null = null;

  constructor() {
    this.metadataButtonSubject.subscribe(() => {
      this.metadataButtonStatus = !this.metadataButtonStatus;
      this.recalculateShowFlags();
    });
    this.optionsButtonSubject.subscribe(() => {
      this.optionsButtonStatus = !this.optionsButtonStatus;
      this.recalculateShowFlags();
    });
    this.menuItemClickSubject.subscribe(menuItem => {
      this.menuItemClicked(this.lastClickedMenuItem, menuItem);
      this.lastClickedMenuItem = menuItem;
    });
  }

  public reset(): void {
    this.displayPanelOptions = false;
    this.labelMetadataDisabled = true;
    this.labelOptionsDisabled = true;
  }

  private recalculateShowFlags(): void {
    if (this.metadataButtonStatus) {
      // open metadata panel and disable options button
      this.metadataPanelSubject.next(true);
      this.labelOptionsSubject.next(false);
    } else {
      this.metadataPanelSubject.next(false);
      this.labelOptionsSubject.next(true);
    }
  }

  private menuItemClicked(oldMenuItem: string | null, newMenuItem: string): void {
    this.menuClickedSubject.next();
    if (oldMenuItem !== newMenuItem) {
      this.menuChangedSubject.next(newMenuItem);
    }
  }

}
