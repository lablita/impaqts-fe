import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ALL_LEMMANS, ALL_WORDS, AS_SUBCORPUS,
  BOTTOM_LEFT, COLLOCATIONS, CONCORDANCE, CORPUS_INFO,
  FILTER, FREQUENCY, INSTALLATION,
  RESULT_CONCORDANCE, SORT, VIEW_OPTIONS, VISUAL_QUERY, WORD_LIST
} from '../model/constants';
import { Installation } from '../model/installation';
import { MenuEmitterService } from './menu-emitter.service';
import { MenuItemObject } from './menu-item-object';

export class MenuEvent {
  constructor(
    public item: string,
  ) { }
}


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public items: MenuItemObject[] = [];
  public urlBottomLeft: string;

  private menuConcordance: MenuItemObject[];
  private menuWordList: MenuItemObject[];
  private menuResultConcordance: MenuItemObject[];
  private concordance: string;
  private wordList: string;
  private corpusInfo: string;
  private allWords: string;
  private allLemmans: string;
  private viewOption: string;
  private sort: string;
  private sample: string;
  private filter: string;
  private frequency: string;
  private collocations: string;
  private visualQuery: string;

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    installation.logos.forEach(logo => {
      if (logo.position === BOTTOM_LEFT) {
        this.urlBottomLeft = logo.url;
      }
    });

    this.translateService.stream('MENU.CONCORDANCE').subscribe(res => this.concordance = res);
    this.translateService.stream('MENU.WOLRD_LIST').subscribe(res => this.wordList = res);
    this.translateService.stream('MENU.CORPUS_INFO').subscribe(res => this.corpusInfo = res);
    this.translateService.stream('MENU.ALL_WORDS').subscribe(res => this.allWords = res);
    this.translateService.stream('MENU.ALL_LEMMANS').subscribe(res => this.allLemmans = res);
    this.translateService.stream('MENU.VIEW_OPTION').subscribe(res => this.viewOption = res);
    this.translateService.stream('MENU.SORT').subscribe(res => this.sort = res);
    this.translateService.stream('MENU.SAMPLE').subscribe(res => this.sample = res);
    this.translateService.stream('MENU.FILTER').subscribe(res => this.filter = res);
    this.translateService.stream('MENU.FREQUENCY').subscribe(res => this.frequency = res);
    this.translateService.stream('MENU.COLLOCATIONS').subscribe(res => this.collocations = res);
    this.translateService.stream('MENU.VISUAL_QUERY').subscribe(res => {
      this.visualQuery = res;

      this.menuDefine();
      this.items = this.getMenuItems(CONCORDANCE);
    });


    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      if (event.item) {
        this.items = this.getMenuItems(event.item);
      }
    });
  }

  private menuDefine(): void {
    this.menuConcordance = [
      new MenuItemObject(this.concordance, null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
      }, null, null, false, false, CONCORDANCE),
      new MenuItemObject(this.wordList, null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(WORD_LIST));
      }, null, null, false, false, null),
      new MenuItemObject(this.corpusInfo, null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(CORPUS_INFO));
      }, null, null, false, false, CORPUS_INFO),
      new MenuItemObject(this.visualQuery, null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(VISUAL_QUERY));
      }, null, null, false, false, VISUAL_QUERY)
    ];

    this.menuWordList = this.menuConcordance.concat(
      [
        new MenuItemObject(null, null, null, null, null, false, true, null),
        new MenuItemObject(this.allWords, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(ALL_WORDS));
        }, null, null, false, false, ALL_WORDS),
        new MenuItemObject(this.allLemmans, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(ALL_LEMMANS));
        }, null, null, false, false, ALL_LEMMANS)
      ]
    );

    this.menuResultConcordance = this.menuConcordance.concat(
      [
        new MenuItemObject(null, null, null, null, null, false, true, null),
        new MenuItemObject(this.viewOption, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(VIEW_OPTIONS));
        }, null, null, false, false, null),
        new MenuItemObject(this.sort, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(SORT));
        }, null, null, false, false, null),
        // new MenuItemObject(this.sample, null, () => {
        //   this.menuEmitterService.click.emit(new MenuEvent(SAMPLE));
        // }, null, null, false, false, null),
        new MenuItemObject(this.filter, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(FILTER));
        }, null, null, false, false, null),
        new MenuItemObject(this.frequency, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(FREQUENCY));
        }, null, null, false, false, null),
        new MenuItemObject(this.collocations, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(COLLOCATIONS));
        }, null, null, false, false, null)
      ]
    );
  }

  public getMenuItems(page: string): MenuItemObject[] {

    switch (page) {
      case CONCORDANCE:

      case WORD_LIST:
      case ALL_WORDS:
      case ALL_LEMMANS:
        return this.menuWordList;

      case RESULT_CONCORDANCE:
      case AS_SUBCORPUS:
      case VIEW_OPTIONS:
      case SORT:
      // case SAMPLE:
      case FILTER:
      case FREQUENCY:
      case COLLOCATIONS:
        return this.menuResultConcordance;

      default:
        return this.menuConcordance;
    }
  }

}
