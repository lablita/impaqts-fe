import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ALL_LEMMANS, ALL_WORDS, CONCORDANCE, CORPUS_INFO, MY_JOBS, WORD_LIST } from '../model/constants';
import { MenuEmitterService } from './menu-emitter.service';
import { MenuEvent } from './menu.component';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuConcordance = [
    {
      label: 'Concordance',
      icon: '',
      url: CONCORDANCE,
      command: () => {
        this.menuEmitterService.click.emit(new MenuEvent(CONCORDANCE));
      }
    },
    {
      label: 'Word list',
      icon: '',
      url: WORD_LIST,
      command: () => {
        this.menuEmitterService.click.emit(new MenuEvent(WORD_LIST));
      }
    },
    {
      label: 'Corpus info',
      icon: '',
      url: CORPUS_INFO,
      command: () => {
        this.menuEmitterService.click.emit(new MenuEvent(CORPUS_INFO));
      }
    },
    {
      label: 'My jobs',
      icon: '',
      url: MY_JOBS,
      command: () => {
        this.menuEmitterService.click.emit(new MenuEvent(MY_JOBS));
      }
    },
    {
      label: '',
      icon: 'pi pi-question-circle',
      url: 'https://www.sketchengine.co.uk/documentationmain-sketch-engine-links'
    },
    {
      label: 'User guide',
      icon: '',
      url: 'https://www.sketchengine.co.uk/documentation',
    }
  ];

  private menuWordList = this.menuConcordance.concat(
    [
      {
        label: 'All words',
        icon: '',
        url: ALL_WORDS,
        command: () => {
          this.menuEmitterService.click.emit(new MenuEvent(ALL_WORDS));
        }
      },
      {
        label: 'All lemmans',
        icon: '',
        url: ALL_LEMMANS,
        command: () => {
          this.menuEmitterService.click.emit(new MenuEvent(ALL_LEMMANS));
        }
      },
      {
        label: '',
        icon: 'pi pi-question-circle',
        url: 'https://www.sketchengine.co.uk/documentationword-list'
      }
    ]
  );

  private items: MenuItem[] = [];

  constructor(
    private readonly menuEmitterService: MenuEmitterService
  ) {
    if (!localStorage.getItem('menu')) {
      localStorage.setItem('menu', CONCORDANCE);
    }
    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      if (event.item) {
        localStorage.setItem('menu', event.item);
      }
    });
  }

  public getMenuItems(): MenuItem[] {
    const page = localStorage.getItem('menu');
    switch (page) {
      case CONCORDANCE:
        return this.menuConcordance;

      // case WORD_LIST:
      case WORD_LIST: return this.menuWordList;

      default: return this.menuConcordance;
    }
  }



}
