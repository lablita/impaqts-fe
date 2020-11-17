import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {
  ALL_LEMMANS, ALL_WORDS, AS_SUBCORPUS, COLLOCATIONS, CONCORDANCE,
  CONC_DECS, CORPUS_INFO, FILTER, FIRST_HIT_IN_DOC, FREQUENCY, KWIC, LEFT,
  MY_JOBS, NODE, NODE_FORMS, NODE_TAGS, OVERLAPS, RESULT_CONCORDANCE, RIGHT,
  SAMPLE, SAVE, SENTENCE, SHUFFLE, SORT, VIEW_OPTIONS, VISUALIZE, WORD_LIST
} from '../model/constants';
import { MenuEmitterService } from './menu-emitter.service';
import { MenuItemObject } from './menu-item-object';
import { MenuEvent } from './menu.component';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuConcordance = [
    new MenuItemObject('Concordance', null, () => {
      this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
    }, null, null, false, false, CONCORDANCE),
    new MenuItemObject('Word list', null, () => {
      this.menuEmitterService.click.emit(new MenuEvent(WORD_LIST));
    }, null, null, false, false, WORD_LIST),
    new MenuItemObject('Corpus info', null, () => {
      this.menuEmitterService.click.emit(new MenuEvent(CORPUS_INFO));
    }, null, null, false, false, CORPUS_INFO),
    new MenuItemObject('My jobs', null, () => {
      this.menuEmitterService.click.emit(new MenuEvent(MY_JOBS));
    }, null, null, false, false, MY_JOBS),
    new MenuItemObject(null, 'pi pi-question-circle', null, 'https://www.sketchengine.co.uk/documentationmain-sketch-engine-links',
      null, false, false, null),
    new MenuItemObject(null, null, null, null, null, false, true, null),
    new MenuItemObject('User guide', null, null, null, null, false, false, null),
  ];

  private menuWordList = this.menuConcordance.concat(
    [
      new MenuItemObject(null, null, null, null, null, false, true, null),
      new MenuItemObject('All words', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(ALL_WORDS));
      }, null, null, false, false, ALL_WORDS),
      new MenuItemObject('All lemmans', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(ALL_LEMMANS));
      }, null, null, false, false, ALL_LEMMANS),
      new MenuItemObject(null, 'pi pi-question-circle', null, 'https://www.sketchengine.co.uk/documentationword-list',
        null, false, false, null),
    ]
  );

  private menuResultConcordance = this.menuConcordance.concat(
    [
      new MenuItemObject(null, null, null, null, null, false, true, null),
      new MenuItemObject('Save', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(SAVE));
      }, null, [
        new MenuItemObject('as subcorpus', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(AS_SUBCORPUS));
        }, null, null, false, false, AS_SUBCORPUS),
      ], false, false, SAVE),
      new MenuItemObject('View options', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(VIEW_OPTIONS));
      }, null, [
        new MenuItemObject('KWIC', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(KWIC));
        }, null, null, false, false, KWIC),
        new MenuItemObject('Sentence', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(SENTENCE));
        }, null, null, false, false, SENTENCE),
      ], false, false, VIEW_OPTIONS),
      new MenuItemObject('Sort', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(SORT));
      }, null, [
        new MenuItemObject('Left', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(LEFT));
        }, null, null, false, false, LEFT),
        new MenuItemObject('Right', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(RIGHT));
        }, null, null, false, false, RIGHT),
        new MenuItemObject('Node', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(NODE));
        }, null, null, false, false, NODE),
        new MenuItemObject('Shuffle', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(SHUFFLE));
        }, null, null, false, false, SHUFFLE),
      ], false, false, SORT),
      new MenuItemObject('Sample', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(SAMPLE));
      }, null, null, false, false, SAMPLE),
      new MenuItemObject('Filter', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(FILTER));
      }, null, [
        new MenuItemObject('Overlaps', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(OVERLAPS));
        }, null, null, false, false, OVERLAPS),
        new MenuItemObject('1th hit in doc', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(FIRST_HIT_IN_DOC));
        }, null, null, false, false, FIRST_HIT_IN_DOC),
      ], false, false, FILTER),
      new MenuItemObject('Frequency', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(FREQUENCY));
      }, null, [
        new MenuItemObject('Node tags', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(NODE_TAGS));
        }, null, null, false, false, NODE_TAGS),
        new MenuItemObject('Node forms', null, () => {
          this.menuEmitterService.click.emit(new MenuEvent(NODE_FORMS));
        }, null, null, false, false, NODE_FORMS),
      ], false, false, FREQUENCY),
      new MenuItemObject('Collocations', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(COLLOCATIONS));
      }, null, null, false, false, COLLOCATIONS),
      new MenuItemObject('ConcDesc', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(CONC_DECS));
      }, null, null, false, false, CONC_DECS),
      new MenuItemObject('Visualize', null, () => {
        this.menuEmitterService.click.emit(new MenuEvent(VISUALIZE));
      }, null, null, false, false, VISUALIZE),
      new MenuItemObject(null, 'pi pi-question-circle', null, 'https://www.sketchengine.co.uk/documentationconcordance',
        null, false, false, null),
    ]
  );

  private items: MenuItem[] = [];

  constructor(
    private readonly menuEmitterService: MenuEmitterService
  ) { }

  public getMenuItems(page: string): MenuItem[] {
    switch (page) {
      case CONCORDANCE:
      case MY_JOBS:
        return this.menuConcordance;

      case WORD_LIST:
      case ALL_WORDS:
      case ALL_LEMMANS:
        return this.menuWordList;

      case RESULT_CONCORDANCE:
      case SAVE:
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
