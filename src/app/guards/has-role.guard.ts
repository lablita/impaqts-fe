import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ADMIN, ADVANCEDUSER, ALL_LEMMANS, ALL_WORDS, CORPUS_INFO, POC, USER, VISUAL_QUERY } from '../model/constants';


export class RoleMenu {
  role: 'ADMIN' | 'ADVANCEDUSER' | 'USER';
  menu: string[];

  constructor(role: 'ADMIN' | 'ADVANCEDUSER' | 'USER', menu: string[]) {
    this.role = role;
    this.menu = menu;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  private rolesMenu: RoleMenu[] = [
    new RoleMenu(ADMIN, [POC, CORPUS_INFO, ALL_WORDS, ALL_LEMMANS, VISUAL_QUERY]),
    new RoleMenu(ADVANCEDUSER, [POC, CORPUS_INFO, VISUAL_QUERY]),
    new RoleMenu(USER, [VISUAL_QUERY]),
  ];

  constructor(
    private readonly authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$.pipe(map(u => {
      if (!!u) {
        const roleMenu = this.getMenuByRole(u['https://impaqts.eu.auth0.meta/role'])
        roleMenu?.menu.find(path => path === route.url[0].path)
        return !!roleMenu?.menu.find(path => path === route.url[0].path);
      }
      return false;
    }));
  }

  private getMenuByRole(role: 'ADMIN' | 'ADVANCEDUSER' | 'USER'): RoleMenu | undefined {
    return this.rolesMenu.find(rm => rm.role === role);
  }

}
