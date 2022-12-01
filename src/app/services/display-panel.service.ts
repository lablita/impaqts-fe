import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { COLLOCATION_OPTION_LABEL, COPYRIGHT, CREDITS, FILTER_OPTION_LABEL, FREQ_OPTION_LABEL, MENU_CONCORDANCE, 
  SORT_OPTION_LABEL, VIEW_OPTION_LABEL, WORD_LIST_OPTION_LABEL} from '../common/label-constants';
import { ALL_LEMMAS, ALL_WORDS, COLLOCATION, CONCORDANCE, COPYRIGHT_ROUTE, CORPUS_INFO, CREDITS_ROUTE, FILTER, FREQUENCY, QUERY, SORT, VIEW_OPTION, VISUAL_QUERY, WORD_LIST} from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { PanelLabelStatus } from '../model/panel-label-status';


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
  CREDITS_ROUTE,
  COPYRIGHT_ROUTE,
]

const panelLabelStatusStart = new PanelLabelStatus(false, false, true, true, false, true, new KeyValueItem(VIEW_OPTION, VIEW_OPTION_LABEL));
const panelLabelStatusNoLabel = new PanelLabelStatus(false, false, false, false, false, false, new KeyValueItem(VIEW_OPTION, VIEW_OPTION_LABEL));

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
  
  // signals for page events
  public metadataPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelOptionsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelMetadataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public optionsPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // signals from page events
  public labelMTDClickSubject: Subject<void> = new Subject();
  public labelOPTClickSubject: Subject<void> = new Subject();
  public menuItemClickSubject: Subject<string> = new Subject();
  
  //states
  private panelLabelStatus: PanelLabelStatus = panelLabelStatusNoLabel; 
  private lastClickedMenuItem: string | null = null;
 
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
        this.panelLabelStatus.titleLabelKeyValue);
        this.optionsPanelSubject.next(false);
        this.labelMetadataSubject.next(true);
        if (panelDisplayMTD)  {
          this.closeMetadataPanel();
        }
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
        this.panelLabelStatus.titleLabelKeyValue);
        this.optionsPanelSubject.next(true);
        this.labelMetadataSubject.next(false);
        if (panelDisplayOPT)  {
          this.closeOptionsPanel();
        }
        this.panelLabelStatusSubject.next(this.panelLabelStatus);
    });
    this.menuItemClickSubject.subscribe(menuItem => {
      if (MENU_NO_LABEL.indexOf(menuItem) >= 0) {
        this.panelLabelStatus = new PanelLabelStatus(false, false, false, false, false, false, new KeyValueItem(VIEW_OPTION, VIEW_OPTION_LABEL));
      } else if (MENU_LABEL.indexOf(menuItem) >= 0) {
        if (this.lastClickedMenuItem === menuItem) {
          //same menu
          const panelDisplayOPT = this.panelLabelStatus.panelDisplayOPT;
          this.panelLabelStatus = new PanelLabelStatus(
            false, 
            !panelDisplayOPT,
            true,
            true,
            !panelDisplayOPT,
            false,
            this.panelLabelStatus.titleLabelKeyValue);
        } else {
          //other menu
          this.panelLabelStatus = new PanelLabelStatus(
            false, 
            true,
            true,
            true,
            true,
            false, this.panelLabelStatus.titleLabelKeyValue);
        }
      } else {//start
        this.panelLabelStatus = panelLabelStatusStart;
      }
      const menuToPanelLabelItem = MENU_TO_PANEL_LABEL.find(item => item.key === menuItem);
      
      this.panelLabelStatus.titleLabelKeyValue = menuToPanelLabelItem ? menuToPanelLabelItem : new KeyValueItem(VIEW_OPTION, VIEW_OPTION_LABEL);
      this.panelLabelStatusSubject.next(this.panelLabelStatus);
      this.lastClickedMenuItem = menuItem;
    });
  }

  public reset(): void {
    this.closeOptionsPanel();
    this.closeMetadataPanel();
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
}
