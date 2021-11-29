import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RoleMenu } from '../model/role-menu';


@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  private menuByRoleList: RoleMenu[] = [];


  constructor(
    private readonly authService: AuthService
  ) {
    this.menuByRoleList = environment.menuByRoleList;
  }

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

  private getMenuByRole(role: string): RoleMenu | undefined {
    return this.menuByRoleList.find(rm => rm.role === role);
  }

}
