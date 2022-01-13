import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import {
  ALL_LEMMANS, ALL_WORDS, AS_SUBCORPUS,
  BOTTOM_LEFT, COLLOCATIONS, CONCORDANCE, CORPUS_INFO,
  FILTER, FREQUENCY, INSTALLATION, RESULT_CONCORDANCE, SORT, VIEW_OPTIONS, VISUAL_QUERY, WORD_LIST
} from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { RoleMenu } from '../model/role-menu';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { EmitterService } from '../utils/emitter.service';
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
  public urlBottomLeft: string | null = null;

  private readonly menuConcordanceStr: string[] = [CONCORDANCE, CORPUS_INFO, VISUAL_QUERY];
  private readonly menuWordListStr: string[] = [ALL_WORDS, ALL_LEMMANS];
  private readonly menuResultConcordanceStr: string[] = [VIEW_OPTIONS, WORD_LIST, SORT, FILTER, FREQUENCY, COLLOCATIONS];

  private role = '';
  private menuByRoleList: RoleMenu[] = [];
  private roles: string[] = [];
  private menuNoRole: string[] = [];
  private menuRoutes: KeyValueItem[] = [];
  public user: User = new User();

  constructor(
    private readonly emitterService: EmitterService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly translateService: TranslateService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.emitterService.user.subscribe({
      next: user => {
        this.user = user;
      }
    });

    this.role = this.userService.getRole();
    this.roles = environment.roles;
    this.menuByRoleList = environment.menuByRoleList;
    this.menuNoRole = environment.menuNoRole;
    this.menuRoutes = environment.menuRoutes;

    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      const installation = JSON.parse(inst) as Installation;
      installation.logos.forEach(logo => {
        if (logo.position === BOTTOM_LEFT) {
          this.urlBottomLeft = logo.url;
        }
      });
    }

    this.getMenuItems(CONCORDANCE, this.role);
    this.menuEmitterService.menuEvent$.subscribe({
      next: (event: MenuEvent) => {
        if (event && event.item) {
          this.getMenuItems(event.item, this.role);
        }
        if (this.menuEmitterService.corpusSelected && this.items && event.item === CONCORDANCE) {
          this.getMenuItems(RESULT_CONCORDANCE, this.role);
        }
      }
    });
  }

  private getVoiceMenu(routesRole: string[], routesPage: string[]): void {
    this.translateService.stream(CONCORDANCE).subscribe({
      next: res => {
        // unisco le rotte dell'utente con quelle della pagina visitata
        const routeNoRole = this.getRoutesByMenu(this.menuNoRole, this.menuRoutes);
        let routes = routeNoRole.concat(routesRole.concat(routesPage));
        routes = [...new Set(routes)];
        const menuItems: MenuItemObject[] = [];
        routes.forEach(route => {
          const menuItem = this.getMenuByRoute(route, this.menuRoutes);
          menuItems.push(new MenuItemObject(this.translateService.instant(menuItem), null, () => {
            this.menuEmitterService.menuEvent$.next(new MenuEvent(route));
          }, null, null, false, false, route));
        }
        );
        this.items = menuItems;
      }
    });
  }

  private getMenuItems(page: string, role: string): void {
    const menuByRole = this.userService.getRole().length > 0 ? this.getMenuByRole(this.userService.getRole()) : [];
    if (menuByRole !== undefined) {
      const routesRole = this.getRoutesByMenu(menuByRole !== undefined ? menuByRole : [], this.menuRoutes);
      switch (page) {
        case CONCORDANCE:
        case VISUAL_QUERY:
        case ALL_WORDS:
        case ALL_LEMMANS:
          this.getVoiceMenu(!!routesRole ? routesRole : [], this.menuWordListStr);
          break;
        case RESULT_CONCORDANCE:
        case AS_SUBCORPUS:
        case VIEW_OPTIONS:
        case WORD_LIST:
        case SORT:
        case FILTER:
        case FREQUENCY:
        case COLLOCATIONS:
          this.getVoiceMenu(!!routesRole ? routesRole : [], this.menuResultConcordanceStr);
          break;

        default:
          this.getVoiceMenu(!!routesRole ? routesRole : [], this.menuConcordanceStr);
          break;
      }
    }
  }

  private getMenuByRole(role: string): string[] | undefined {
    if (role.length > 0) {
      return this.menuByRoleList.find(rm => rm.role === role)?.menu;
    }
    return this.menuNoRole;
  }

  private getRoutesByMenu(menu: string[], menuRoutes: KeyValueItem[]): string[] {
    const result: string[] = [];
    menu.forEach(voiceMenu => {
      const route = menuRoutes.find(i => i.key === voiceMenu)?.value;
      if (route !== undefined) {
        result.push(route);
      }
    });
    return result;
  }

  private getMenuByRoute(route: string, menuRoutes: KeyValueItem[]): string {
    const item = menuRoutes.find(mr => mr.value === route);
    if (item !== undefined) {
      return item.key;
    }
    return '';
  }

}
