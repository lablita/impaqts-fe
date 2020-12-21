import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ALL_LEMMANS, ALL_WORDS, AS_SUBCORPUS, COLLOCATIONS, CONCORDANCE, CONC_DECS, CORPUS_INFO,
  FILTER, FIRST_HIT_IN_DOC, FREQUENCY, KWIC, LEFT, NODE, NODE_FORMS, NODE_TAGS, OVERLAPS,
  RESULT_CONCORDANCE, RIGHT, SAMPLE, SENTENCE, SHUFFLE, SORT, VIEW_OPTIONS, VISUALIZE, WORD_LIST
} from '../model/constants';
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

  private menuConcordance: MenuItemObject[];
  private menuWordList: MenuItemObject[];
  private menuResultConcordance: MenuItemObject[];


  private concordance: string;
  private wordList: string;
  private corpusInfo: string;
  private userGuide: string;
  private allWords: string;
  private allLemmans: string;
  private save: string;
  private asSubcorpus: string;
  private viewOption: string;
  private KWIC: string;
  private sentence: string;
  private sort: string;
  private left: string;
  private right: string;
  private node: string;
  private shuffle: string;
  private sample: string;
  private filter: string;
  private overlaps: string;
  private firstHitToDoc: string;
  private frequency: string;
  private nodeTags: string;
  private nodeForms: string;
  private collocations: string;
  private concDesc: string;
  private visualize: string;


  public items: MenuItemObject[] = [];

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.get('MENU.CONCORDANCE').subscribe(concordance => {
      this.concordance = concordance;
      this.wordList = this.translateService.instant('MENU.WOLRD_LIST') as string;
      this.corpusInfo = this.translateService.instant('MENU.CORPUS_INFO') as string;
      this.userGuide = this.translateService.instant('MENU.USER_GUIDE') as string;
      this.allWords = this.translateService.instant('MENU.ALL_WORDS') as string;
      this.allLemmans = this.translateService.instant('MENU.ALL_LEMMANS') as string;
      this.viewOption = this.translateService.instant('MENU.VIEW_OPTION') as string;
      this.KWIC = this.translateService.instant('MENU.KWIC') as string;
      this.sentence = this.translateService.instant('MENU.SENTENCE') as string;
      this.sort = this.translateService.instant('MENU.SORT') as string;
      this.left = this.translateService.instant('MENU.LEFT') as string;
      this.right = this.translateService.instant('MENU.RIGHT') as string;
      this.node = this.translateService.instant('MENU.NODE') as string;
      this.shuffle = this.translateService.instant('MENU.SHUFFLE') as string;
      this.sample = this.translateService.instant('MENU.SAMPLE') as string;
      this.filter = this.translateService.instant('MENU.FILTER') as string;
      this.overlaps = this.translateService.instant('MENU.OVERLAPS') as string;
      this.firstHitToDoc = this.translateService.instant('MENU.FIRST_HIT_IN_DOC') as string;
      this.frequency = this.translateService.instant('MENU.FREQUENCY') as string;
      this.nodeTags = this.translateService.instant('MENU.NODE_TAGS') as string;
      this.nodeForms = this.translateService.instant('MENU.NODE_FORMS') as string;
      this.collocations = this.translateService.instant('MENU.COLLOCATIONS') as string;
      this.concDesc = this.translateService.instant('MENU.CONC_DECS') as string;
      this.visualize = this.translateService.instant('MENU.VISUALIZE') as string;
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
      new MenuItemObject(null, 'pi pi-question-circle', null, 'https://www.sketchengine.co.uk/documentationmain-sketch-engine-links',
        null, false, false, null),
      new MenuItemObject(null, null, null, null, null, false, true, null),
      new MenuItemObject(this.userGuide, null, null, null, null, false, false, null),
    ];

    this.menuWordList = this.menuConcordance.concat(
      [
        new MenuItemObject(null, null, null, null, null, false, true, null),
        new MenuItemObject(this.allWords, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(ALL_WORDS));
        }, null, null, false, false, ALL_WORDS),
        new MenuItemObject(this.allLemmans, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(ALL_LEMMANS));
        }, null, null, false, false, ALL_LEMMANS),
        new MenuItemObject(null, 'pi pi-question-circle', null, 'https://www.sketchengine.co.uk/documentationword-list',
          null, false, false, null),
      ]
    );

    this.menuResultConcordance = this.menuConcordance.concat(
      [
        new MenuItemObject(null, null, null, null, null, false, true, null),
        new MenuItemObject(this.viewOption, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(VIEW_OPTIONS));
        }, null, [
          new MenuItemObject(this.KWIC, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(KWIC));
          }, null, null, false, false, KWIC),
          new MenuItemObject(this.sentence, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(SENTENCE));
          }, null, null, false, false, SENTENCE),
        ], false, false, VIEW_OPTIONS),
        new MenuItemObject(this.sort, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(SORT));
        }, null, [
          new MenuItemObject(this.left, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(LEFT));
          }, null, null, false, false, LEFT),
          new MenuItemObject(this.right, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(RIGHT));
          }, null, null, false, false, RIGHT),
          new MenuItemObject(this.node, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(NODE));
          }, null, null, false, false, NODE),
          new MenuItemObject(this.shuffle, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(SHUFFLE));
          }, null, null, false, false, SHUFFLE),
        ], false, false, null),
        new MenuItemObject(this.sample, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(SAMPLE));
        }, null, null, false, false, SAMPLE),
        new MenuItemObject(this.filter, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(FILTER));
        }, null, [
          new MenuItemObject(this.overlaps, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(OVERLAPS));
          }, null, null, false, false, OVERLAPS),
          new MenuItemObject(this.firstHitToDoc, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(FIRST_HIT_IN_DOC));
          }, null, null, false, false, FIRST_HIT_IN_DOC),
        ], false, false, null),
        new MenuItemObject(this.frequency, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(FREQUENCY));
        }, null, [
          new MenuItemObject(this.nodeTags, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(NODE_TAGS));
          }, null, null, false, false, NODE_TAGS),
          new MenuItemObject(this.nodeForms, null, () => {
            this.menuEmitterService.click.emit(new MenuEvent(NODE_FORMS));
          }, null, null, false, false, NODE_FORMS),
        ], false, false, null),
        new MenuItemObject(this.collocations, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(COLLOCATIONS));
        }, null, null, false, false, null),
        new MenuItemObject(this.concDesc, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(CONC_DECS));
        }, null, null, false, false, CONC_DECS),
        new MenuItemObject(this.visualize, null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(VISUALIZE));
        }, null, null, false, false, VISUALIZE),
        new MenuItemObject(null, 'pi pi-question-circle', null, 'https://www.sketchengine.co.uk/documentationconcordance',
          null, false, false, null),
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
      case KWIC:
      case SENTENCE:
      case SORT:
      case LEFT:
      case RIGHT:
      case NODE:
      case SHUFFLE:
      case SAMPLE:
      case FILTER:
      case OVERLAPS:
      case FIRST_HIT_IN_DOC:
      case FREQUENCY:
      case NODE_TAGS:
      case NODE_FORMS:
      case COLLOCATIONS:
      case CONC_DECS:
      case VISUALIZE:
        return this.menuResultConcordance;

      default:
        return this.menuConcordance;
    }
  }

}
