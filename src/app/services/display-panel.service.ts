import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { QUERY, VIEW_OPTIONS } from '../common/routes-constants';

const METADATA = 'METADATA';
const OPTIONS = 'OPTIONS';
@Injectable({
  providedIn: 'root'
})
export class DisplayPanelService {

  // signals for page events
  public metadataPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelOptionsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelMetadataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public optionsPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public displayPanelMetadataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public menuChangedSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(QUERY);
  public menuClickedSubject: Subject<void> = new Subject<void>();

  // signals from page events
  public metadataButtonSubject: Subject<void> = new Subject();
  public optionsButtonSubject: Subject<void> = new Subject();
  public menuItemClickSubject: Subject<string> = new Subject();

  //states
  private metadataButtonStatus = false;
  private optionsButtonStatus = false;
  private lastClickedMenuItem: string | null = null;
  private panelMustBeOpened = false;
  private lastPanelOpened: string | null = null;

  public panelSelectedSubject: BehaviorSubject<string> = new BehaviorSubject<string>(VIEW_OPTIONS);

  constructor() {
    this.metadataButtonSubject.subscribe(() => {
      this.metadataButtonStatus = !this.metadataButtonStatus;
      this.recalculateShowFlags(METADATA, true);
    });
    this.optionsButtonSubject.subscribe(() => {
      this.optionsClick(true);
    });
    this.menuItemClickSubject.subscribe(menuItem => {
      this.panelMustBeOpened = this.lastPanelOpened !== menuItem;
      this.lastPanelOpened = menuItem;
      this.menuItemClicked(this.lastClickedMenuItem, menuItem);
      this.lastClickedMenuItem = menuItem;
      if (!this.metadataButtonStatus) {
        this.optionsClick(false);
      }
    });
  }

  public reset(): void {
    this.metadataButtonStatus = false;
    this.optionsButtonStatus = false;
    this.panelMustBeOpened = false;
    this.closeOptionsPanel();
    this.closeMetadataPanel();
    this.disableLabes();
  }

  public activeMetadataButton(): void {
    this.labelMetadataSubject.next(true);
  }

  public activeOptionsButton(): void {
    this.labelOptionsSubject.next(true);
  }

  public closeOptionsPanel(): void {
    this.optionsPanelSubject.next(false);
  }

  private closeMetadataPanel(): void {
    this.metadataPanelSubject.next(false);
  }

  private disableLabes(): void {
    this.labelMetadataSubject.next(false);
    this.labelOptionsSubject.next(false);
  }

  private recalculateShowFlags(buttonClicked: string, clickFromLabel: boolean): void {
    if (buttonClicked === METADATA) {
      if (this.metadataButtonStatus) {
        // open metadata panel and disable options button
        this.metadataPanelSubject.next(true);
        this.labelOptionsSubject.next(false);
      } else {
        this.metadataPanelSubject.next(false);
        this.labelOptionsSubject.next(true);
      }
    } else {
      if (this.optionsButtonStatus && !this.metadataButtonStatus || this.panelMustBeOpened && !clickFromLabel) {
        // open options panel and disable metadata button
        this.optionsPanelSubject.next(true);
        this.labelMetadataSubject.next(false);
      } else {
        this.optionsPanelSubject.next(false);
        this.labelMetadataSubject.next(true);
      }
    }
  }

  private optionsClick(clickFromLabel: boolean): void {
    this.optionsButtonStatus = !this.optionsButtonStatus;
    this.recalculateShowFlags(OPTIONS, clickFromLabel);
  }

  private menuItemClicked(oldMenuItem: string | null, newMenuItem: string): void {
    this.menuClickedSubject.next();
    if (oldMenuItem !== newMenuItem) {
      this.menuChangedSubject.next(newMenuItem);
    }
  }

}
