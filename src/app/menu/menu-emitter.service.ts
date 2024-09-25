import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MENU_ALL_LEMMAS, MENU_ALL_WORDS, MENU_AS_SUBCORPUS, MENU_COLLOCATION, MENU_CONCORDANCE,
  MENU_COPYRIGHT, MENU_CORPUS_INFO, MENU_CREDITS,
  MENU_FREQUENCY, MENU_LOGIN, MENU_RESULT_CONCORDANCE,
  MENU_SORT, MENU_VIEW_OPTION, MENU_VISUAL_QUERY
} from '../common/label-constants';
import { ADMIN, ADVANCEDUSER, USER } from '../common/roles-constants';
import {
  ALL_LEMMAS, ALL_WORDS, AS_SUBCORPUS, COLLOCATION, CONCORDANCE, COPYRIGHT_ROUTE, CORPUS_INFO,
  CREDITS_ROUTE,
  FREQUENCY, QUERY, RESULT_QUERY, SORT, VIEW_OPTION, VISUAL_QUERY
} from '../common/routes-constants';
import { KeyValueItem } from '../model/key-value-item';
import { RoleMenu } from '../model/role-menu';
import { MenuEvent } from './menu.component';

@Injectable({
  providedIn: 'root'
})
export class MenuEmitterService {
  public corpusSelected = false;
  public menuEvent$: Subject<MenuEvent> = new Subject<MenuEvent>();

  private readonly _menuByRoleList: RoleMenu[] = [];
  private readonly _menuNoRole: string[] = [];
  private readonly _menuRoutes: KeyValueItem[] = [];

  constructor() {
    this._menuByRoleList = this.initMenuByRoleList();
    this._menuNoRole = this.initMenuNoRole();
    this._menuRoutes = this.initMenuRoutes();
  }

  public get menuRoutes(): KeyValueItem[] {
    return this._menuRoutes;
  }

  public get menuNoRole(): string[] {
    return this._menuNoRole;
  }

  public get menuByRoleList(): RoleMenu[] {
    return this._menuByRoleList;
  }

  private initMenuByRoleList(): Array<RoleMenu> {
    return [
      new RoleMenu(ADMIN, [MENU_CORPUS_INFO, MENU_ALL_WORDS, MENU_ALL_LEMMAS, MENU_VISUAL_QUERY]),
      new RoleMenu(ADVANCEDUSER, [MENU_CORPUS_INFO, MENU_ALL_WORDS, MENU_ALL_LEMMAS, MENU_VISUAL_QUERY]),
      new RoleMenu(USER, [MENU_CORPUS_INFO, MENU_ALL_WORDS, MENU_ALL_LEMMAS, MENU_VISUAL_QUERY]),
      // new RoleMenu(ADVANCEDUSER, [MENU_CORPUS_INFO, MENU_VISUAL_QUERY]),
      // new RoleMenu(USER, [MENU_VISUAL_QUERY]),
    ];
  }

  private initMenuNoRole(): Array<string> {
    return [MENU_LOGIN, MENU_CONCORDANCE, MENU_ALL_WORDS, MENU_ALL_LEMMAS,
      MENU_CORPUS_INFO, MENU_ALL_WORDS, MENU_ALL_LEMMAS, MENU_VISUAL_QUERY];
  }

  private initMenuRoutes(): Array<KeyValueItem> {
    return [
      new KeyValueItem(MENU_CONCORDANCE, QUERY),
      new KeyValueItem(MENU_CONCORDANCE, CONCORDANCE),
      new KeyValueItem(MENU_CORPUS_INFO, CORPUS_INFO),
      new KeyValueItem(MENU_ALL_WORDS, ALL_WORDS),
      new KeyValueItem(MENU_ALL_LEMMAS, ALL_LEMMAS),
      new KeyValueItem(MENU_CREDITS, CREDITS_ROUTE),
      new KeyValueItem(MENU_COPYRIGHT, COPYRIGHT_ROUTE),
      new KeyValueItem(MENU_VISUAL_QUERY, VISUAL_QUERY),
      new KeyValueItem(MENU_RESULT_CONCORDANCE, RESULT_QUERY),
      new KeyValueItem(MENU_AS_SUBCORPUS, AS_SUBCORPUS),
      new KeyValueItem(MENU_VIEW_OPTION, VIEW_OPTION),
      new KeyValueItem(MENU_SORT, SORT),
      new KeyValueItem(MENU_FREQUENCY, FREQUENCY),
      new KeyValueItem(MENU_COLLOCATION, COLLOCATION),
    ];
  }

}
