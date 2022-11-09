import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { KeyValueItem } from '../model/key-value-item';
import { RoleMenu } from '../model/role-menu';


@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  private readonly menuByRoleList: Array<RoleMenu>;
  private readonly menuRoutes: Array<KeyValueItem>;


  constructor(
    private readonly authService: AuthService,
    private readonly menuEmitterService: MenuEmitterService
  ) {
    this.menuByRoleList = this.menuEmitterService.menuByRoleList;
    this.menuRoutes = this.menuEmitterService.menuRoutes;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$.pipe(map(u => {
      if (!!u) {
        const menu = this.getMenuByRole(u['https://impaqts.eu.auth0.meta/role']);
        const routes = this.getRoutesByMenu(menu, this.menuRoutes);
        return !!routes.find(path => path === route.url[0].path);
      }
      return false;
    }));
  }

  private getMenuByRole(role: string): string[] {
    const menuRole = this.menuByRoleList.find(rm => rm.role === role);
    return !!menuRole ? menuRole.menu : [];
  }

  private getRoutesByMenu(menu: string[], menuRoutes: KeyValueItem[]): string[] {
    const result: string[] = [];
    menu.forEach(itemMenu => {
      const route = menuRoutes.find(i => i.key === itemMenu)?.value;
      if (route !== undefined) {
        result.push(route);
      }
    });
    return result;
  }

}
