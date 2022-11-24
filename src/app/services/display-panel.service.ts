import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { COLLOCATION_OPTION_LABEL, COPYRIGHT, CREDITS, FILTER_OPTION_LABEL, FREQ_OPTION_LABEL, MENU_CONCORDANCE, 
  SORT_OPTION_LABEL, VIEW_OPTION_LABEL, WORD_LIST_OPTION_LABEL} from '../common/label-constants';
import { ALL_LEMMAS, ALL_WORDS, COLLOCATION, CONCORDANCE, CORPUS_INFO, FILTER, FREQUENCY, QUERY, SORT, VIEW_OPTION, VISUAL_QUERY, WORD_LIST} from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { PanelLabelStatus } from '../model/panel-label-status';

const METADATA = 'METADATA';
const OPTIONS = 'OPTIONS';

const MENU_LABEL = [
  VIEW_OPTION,
  SORT,
  FILTER,
  FREQUENCY,
  COLLOCATION
];

const MENU_NO_LABEL = [
  CORPUS_INFO,
  ALL_WORDS,
  ALL_LEMMAS,
  VISUAL_QUERY,
  WORD_LIST,
  CREDITS,
  COPYRIGHT
]

const MENU_START = MENU_CONCORDANCE; 

const panelLabelStatusStart = new PanelLabelStatus(false, false, true, true, false, true, VIEW_OPTION_LABEL);
const panelLabelStatusNoLabel = new PanelLabelStatus(false, false, false, false, false, false, VIEW_OPTION_LABEL);

const MENU_TO_PANEL_LABEL: KeyValueItem[] = [
  new KeyValueItem(CONCORDANCE, VIEW_OPTION_LABEL),
  new KeyValueItem(VIEW_OPTION, VIEW_OPTION_LABEL),
  new KeyValueItem(WORD_LIST, WORD_LIST_OPTION_LABEL),
  new KeyValueItem(SORT, SORT_OPTION_LABEL),
  new KeyValueItem(FILTER, FILTER_OPTION_LABEL),
  new KeyValueItem(FREQUENCY, FREQ_OPTION_LABEL),
  new KeyValueItem(COLLOCATION, COLLOCATION_OPTION_LABEL)
];

@Injectable({
  providedIn: 'root'
})
export class DisplayPanelService {


    
  public panelLabelStatusSubject: BehaviorSubject<PanelLabelStatus> = new BehaviorSubject<PanelLabelStatus>(panelLabelStatusStart);

  private panelLabelStatus: PanelLabelStatus = panelLabelStatusNoLabel; 




  // signals for page events
  public metadataPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelOptionsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelMetadataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public optionsPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public displayPanelMetadataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public menuChangedSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(QUERY);
  public menuClickedSubject: Subject<void> = new Subject<void>();

  // signals from page events
  public labelMTDClickSubject: Subject<void> = new Subject();
  public labelOPTClickSubject: Subject<void> = new Subject();
  public menuItemClickSubject: Subject<string> = new Subject();

  //states
  //private metadataButtonStatus = false;
  private optionsButtonStatus = false;
  private lastClickedMenuItem: string | null = null;
  //private panelMustBeOpened = false;
  //private lastPanelOpened: string | null = null;

  public panelSelectedSubject: BehaviorSubject<string> = new BehaviorSubject<string>(VIEW_OPTION);

  constructor() {
    this.labelMTDClickSubject.subscribe(() => {
      const panelDisplayMTD = this.panelLabelStatus.panelDisplayMTD;
      this.panelLabelStatus = new PanelLabelStatus(
        !panelDisplayMTD, 
        false,
        true,
        true,
        false,
        !panelDisplayMTD,
        this.panelLabelStatus.titleLabel);
        this.panelLabelStatusSubject.next(this.panelLabelStatus); 
    });
    this.labelOPTClickSubject.subscribe(() => {
      const panelDisplayOPT = this.panelLabelStatus.panelDisplayOPT;
      this.panelLabelStatus = new PanelLabelStatus(
        false, 
        !panelDisplayOPT,
        true,
        true,
        !panelDisplayOPT,
        false,
        this.panelLabelStatus.titleLabel);
        this.panelLabelStatusSubject.next(this.panelLabelStatus);
    });
    this.menuItemClickSubject.subscribe(menuItem => {
      if (MENU_NO_LABEL.indexOf(menuItem) >= 0) {
        this.panelLabelStatus = new PanelLabelStatus(false, false, false, false, false, false, VIEW_OPTION_LABEL);
      } else if (MENU_LABEL.indexOf(menuItem) >= 0) {
        if (this.lastClickedMenuItem === menuItem) {
          //same menu
          const panelDisplayOPT = this.panelLabelStatus.panelDisplayOPT;

          this.panelLabelStatus = new PanelLabelStatus(
            false, 
            !panelDisplayOPT,
            true,
            true,
            panelDisplayOPT,
            false,
            this.panelLabelStatus.titleLabel);
        } else {
          //other menu
          this.panelLabelStatus = new PanelLabelStatus(
            false, 
            true,
            true,
            true,
            true,
            false, this.panelLabelStatus.titleLabel);
        }
      } else {//start
        this.panelLabelStatus = panelLabelStatusStart;
      }
      const menuToPanelLabelItem = MENU_TO_PANEL_LABEL.find(item => item.key === menuItem);
      
      this.panelLabelStatus.titleLabel = menuToPanelLabelItem ? menuToPanelLabelItem.value : VIEW_OPTION_LABEL;
      this.panelLabelStatusSubject.next(this.panelLabelStatus);
      this.lastClickedMenuItem = menuItem;
      
      // this.panelMustBeOpened = this.lastPanelOpened !== menuItem;
      // //this.lastPanelOpened = menuItem;
      // this.menuItemClicked(this.lastClickedMenuItem, menuItem);
      // this.lastClickedMenuItem = menuItem;
      // if (!this.metadataButtonStatus) {
      //   this.optionsClick(false);
      // }
    });
  }

  public reset(): void {
    //new code
    //this.panelLabelStatus = new PanelLabelStatus(false, false, false, false, false, false);

    //
    // this.metadataButtonStatus = false;
    // this.optionsButtonStatus = false;
    // this.panelMustBeOpened = false;
    // this.closeOptionsPanel();
    // this.closeMetadataPanel();
    // this.disableLabes();
  }

  // public activeMetadataButton(): void {
  //   this.labelMetadataSubject.next(true);
  // }

  public activeOptionsButton(): void {
    this.labelOptionsSubject.next(true);
  }

  public closeOptionsPanel(): void {
    this.optionsPanelSubject.next(false);
  }

  public getOptionButtonStatus(): boolean {
    return this.optionsButtonStatus;
  }

  // private closeMetadataPanel(): void {
  //   this.metadataPanelSubject.next(false);
  // }

  // private disableLabes(): void {
  //   this.labelMetadataSubject.next(false);
  //   this.labelOptionsSubject.next(false);
  // }

  // private recalculateShowFlags(buttonClicked: string, clickFromLabel: boolean): void {
  //   if (buttonClicked === METADATA) {
  //     if (this.metadataButtonStatus) {
  //       // open metadata panel and disable options button
  //       this.metadataPanelSubject.next(true);
  //       this.labelOptionsSubject.next(false);
  //     } else {
  //       this.metadataPanelSubject.next(false);
  //       this.labelOptionsSubject.next(true);
  //     }
  //   } else {
  //     if (this.optionsButtonStatus && !this.metadataButtonStatus || this.panelMustBeOpened && !clickFromLabel) {
  //       // open options panel and disable metadata button
  //       this.optionsPanelSubject.next(true);
  //       this.labelMetadataSubject.next(false);
  //     } else {
  //       this.optionsPanelSubject.next(false);
  //       this.labelMetadataSubject.next(true);
  //     }
  //   }
  // }

  // private optionsClick(clickFromLabel: boolean): void {
  //   this.optionsButtonStatus = !this.optionsButtonStatus;
  //   this.recalculateShowFlags(OPTIONS, clickFromLabel);
  // }

  // private menuItemClicked(oldMenuItem: string | null, newMenuItem: string): void {
  //   this.menuClickedSubject.next();
  //   if (oldMenuItem !== newMenuItem) {
  //     this.menuChangedSubject.next(newMenuItem);
  //   }
  // }

}
