import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ALL_LEMMAS, ALL_WORDS, AS_SUBCORPUS, COLLOCATIONS, CONCORDANCE, CORPUS_INFO, FILTER, FREQUENCY, QUERY, RESULT_CONCORDANCE, SORT, VIEW_OPTIONS, VISUAL_QUERY, WORD_LIST } from '../common/routes-constants';
import { BOTTOM_LEFT, INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { RoleMenu } from '../model/role-menu';
import { User } from '../model/user';
import { DisplayPanelService } from '../services/display-panel.service';
import { QueryRequestService } from '../services/query-request.service';
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
  private readonly menuWordListStr: string[] = [ALL_WORDS, ALL_LEMMAS];
  private readonly menuDisplayPanel: string[] = [VIEW_OPTIONS, WORD_LIST, SORT, FILTER, FREQUENCY, COLLOCATIONS];

  private role = '';
  private menuByRoleList: RoleMenu[] = [];
  private menuNoRole: string[] = [];
  private menuRoutes: KeyValueItem[] = [];
  public user: User = new User();

  private menuEmitterServiceSubscription: Subscription | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly translateService: TranslateService,
    private readonly displayPanelService: DisplayPanelService,
    private readonly authService: AuthService,
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(u => {
      if (!!u) {
        const user: User = new User(u.name, u['https://impaqts.eu.auth0.meta/email'], u['https://impaqts.eu.auth0.meta/role']);
        this.role = !!user.role ? user.role : '';
      }

      this.menuByRoleList = this.menuEmitterService.menuByRoleList;
      this.menuNoRole = this.menuEmitterService.menuNoRole;
      this.menuRoutes = this.menuEmitterService.menuRoutes;

      const inst = localStorage.getItem(INSTALLATION);
      if (inst) {
        const installation = JSON.parse(inst) as Installation;
        installation.logos.forEach(logo => {
          if (logo.position === BOTTOM_LEFT) {
            this.urlBottomLeft = logo.url;
          }
        });
      }

      this.setMenuItems(CONCORDANCE, this.role);
      if (!this.menuEmitterServiceSubscription) {
        this.menuEmitterServiceSubscription = this.menuEmitterService.menuEvent$.subscribe({
          next: (event: MenuEvent) => {
            if (event && event.item) {
              this.setMenuItems(event.item, this.role);
            }
            if (this.menuEmitterService.corpusSelected && this.items && event.item === QUERY) {
              this.setMenuItems(RESULT_CONCORDANCE, this.role);
            }
          }
        });
      }
    });
  }

  private setMenuItemsByRole(routesRole: string[], routesPage: string[]): void {
    this.translateService.stream(CONCORDANCE).subscribe({
      next: res => {
        // unisco le rotte dell'utente con quelle della pagina visitata
        const routeNoRole = this.getRoutesByMenu(this.menuNoRole, this.menuRoutes);
        let routes = routeNoRole.concat(routesRole.concat(routesPage));
        routes = [...new Set(routes)];
        const menuItems: MenuItemObject[] = [];
        routes.forEach(route => {
          const menuItem = this.getMenuByRoute(route, this.menuRoutes);
          const menuCommand = () => {
            this.emitterService.pageMenu = route;
            //  this.displayPanelService.panelItemSelected = route;
            //  this.displayPanelService.displayPanelOptions = this.menuDisplayPanel.filter(item => item === route).length > 0;
            // this.displayPanelService.panelDisplaySubject.next(this.displayPanelService.displayPanelOptions || this.displayPanelService.displayPanelMetadata);
            this.queryRequestService.resetOptionsRequest();
            this.menuEmitterService.menuEvent$.next(new MenuEvent(route));
            this.displayPanelService.menuItemClickSubject.next(route);
          };
          const menuItemObject = new MenuItemObject(this.translateService.instant(menuItem), null, menuCommand, null, null, false, false, route);
          //menuItemObject.command =
          menuItems.push(menuItemObject);
        }
        );
        this.items = menuItems;
      }
    });
  }

  private setMenuItems(page: string, role: string): void {
    const menuByRole = this.getMenuByRole(role);
    if (menuByRole !== undefined) {
      const routesRole = this.getRoutesByMenu(menuByRole !== undefined ? menuByRole : [], this.menuRoutes);
      switch (page) {
        case QUERY:
        case VISUAL_QUERY:
        case ALL_WORDS:
        case ALL_LEMMAS:
          this.setMenuItemsByRole(!!routesRole ? routesRole : [], this.menuWordListStr);
          break;
        case RESULT_CONCORDANCE:
        case AS_SUBCORPUS:
        case VIEW_OPTIONS:
        case WORD_LIST:
        case SORT:
        case FILTER:
        case FREQUENCY:
        case COLLOCATIONS:
          this.setMenuItemsByRole(!!routesRole ? routesRole : [], this.menuDisplayPanel);
          break;

        default:
          this.setMenuItemsByRole(!!routesRole ? routesRole : [], this.menuConcordanceStr);
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
    menu.forEach(menuItem => {
      const route = menuRoutes.find(i => i.key === menuItem)?.value;
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
