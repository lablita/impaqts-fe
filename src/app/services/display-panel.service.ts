import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  COLLOCATION_OPTION_LABEL,
  FILTER_OPTION_LABEL, FREQ_OPTION_LABEL,
  SORT_OPTION_LABEL, VIEW_OPTION_LABEL, WORD_LIST_OPTION_LABEL
} from '../common/label-constants';
import { ALL_LEMMAS, ALL_WORDS, COLLOCATION, CONCORDANCE, COPYRIGHT_ROUTE, CORPUS_INFO, CREDITS_ROUTE, FILTER, FREQUENCY, QUERY, RESULT_COLLOCATION, SORT, VIEW_OPTION, VISUAL_QUERY, WORD_LIST } from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { PanelLabelStatus } from '../model/panel-label-status';
import { LastResultService } from './last-result.service';


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
  RESULT_COLLOCATION
]

const panelLabelStatusStart = new PanelLabelStatus(false, false, true, true, false, true, new KeyValueItem(SORT, SORT_OPTION_LABEL));
const panelLabelStatusNoLabel = new PanelLabelStatus(false, false, false, false, false, false, new KeyValueItem(SORT, SORT_OPTION_LABEL));

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
export class DisplayPanelService implements OnDestroy {

  public panelLabelStatusSubject: BehaviorSubject<PanelLabelStatus> = new BehaviorSubject<PanelLabelStatus>(panelLabelStatusNoLabel);

  // signals for page events
  public metadataPanelSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public labelOptionsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // signals from page events
  public labelMTDClickSubject: Subject<void> = new Subject();
  public labelOPTClickSubject: Subject<void> = new Subject();
  public menuItemClickSubject: Subject<string> = new Subject();

  //states
  private panelLabelStatus: PanelLabelStatus = panelLabelStatusStart;
  private lastClickedMenuItem: string | null = null;

  //MenuItem
  private menuItem = QUERY;

  constructor(
    private readonly lastResultService: LastResultService
  ) {
    if (this.menuItem) {
      this.setPanelLabelStatusByMenuItem(this.menuItem);
      this.panelLabelStatusSubject.next(this.panelLabelStatus);
    }
    this.labelMTDClickSubject.subscribe(() => {
      const panelDisplayMTD = this.panelLabelStatus.panelDisplayMTD;
      this.panelLabelStatus = new PanelLabelStatus(
        !panelDisplayMTD,
        false,
        true,
        true,
        false,
        !panelDisplayMTD || !!this.lastResultService.getLastResult().kwicLines && this.lastResultService.getLastResult().kwicLines!.length === 0,
        this.panelLabelStatus.titleLabelKeyValue);
      if (panelDisplayMTD) {
        this.closeMetadataPanel();
      }
      this.panelLabelStatusSubject.next(this.panelLabelStatus);

    });
    this.labelOPTClickSubject.subscribe(() => {
      const panelDisplayOPT = this.panelLabelStatus.panelDisplayOPT;
      this.panelLabelStatus = new PanelLabelStatus(
        false,
        !this.panelLabelStatus.panelDisplayOPT,
        true,
        !this.panelLabelStatus.labelDisableOPT,
        !(this.panelLabelStatus.panelDisplayMTD || this.panelLabelStatus.panelDisplayOPT),
        false,
        this.panelLabelStatus.titleLabelKeyValue);
      this.panelLabelStatusSubject.next(this.panelLabelStatus);
    });
    this.menuItemClickSubject.subscribe(menuItem => {
      this.setPanelLabelStatusByMenuItem(menuItem);
      const menuToPanelLabelItem = MENU_TO_PANEL_LABEL.find(item => item.key === menuItem);
      this.panelLabelStatus.titleLabelKeyValue = menuToPanelLabelItem ? menuToPanelLabelItem : new KeyValueItem(SORT, SORT_OPTION_LABEL);
      this.panelLabelStatusSubject.next(this.panelLabelStatus);
      this.lastClickedMenuItem = menuItem;
    });
  }

  ngOnDestroy(): void {
    if (this.metadataPanelSubject) {
      this.metadataPanelSubject.unsubscribe();
    }
    if (this.labelOptionsSubject) {
      this.labelOptionsSubject.unsubscribe();
    }
    if (this.labelMTDClickSubject) {
      this.labelMTDClickSubject.unsubscribe();
    }
    if (this.labelOPTClickSubject) {
      this.labelOPTClickSubject.unsubscribe();
    }
    if (this.menuItemClickSubject) {
      this.menuItemClickSubject.unsubscribe();
    }
  }

  public getOptionPanelDisplayed(): boolean {
    return this.panelLabelStatus.panelDisplayOPT;
  }

  public setMenuItem(menuItem: string) {
    this.menuItem = menuItem;
  }

  public closePanel(): void {
    this.panelLabelStatusSubject.next(panelLabelStatusStart);
  }

  public reset(): void {
    this.closeMetadataPanel();
  }

  public activeOptionsButton(): void {
    this.labelOptionsSubject.next(true);
  }

  public enableOptLabel(): void {
    this.panelLabelStatus.labelDisableOPT = false;
    this.panelLabelStatusSubject.next(this.panelLabelStatus);
  }

  private closeMetadataPanel(): void {
    this.metadataPanelSubject.next(false);
  }

  private setPanelLabelStatusByMenuItem(menuItem: string): void {
    if (MENU_NO_LABEL.indexOf(menuItem) >= 0) {
      this.panelLabelStatus = new PanelLabelStatus(false, false, false, false, false, false, new KeyValueItem(SORT, SORT_OPTION_LABEL));
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
  }
}
