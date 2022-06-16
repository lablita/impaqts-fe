import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { HasRoleGuard } from './has-role.guard';

@Injectable({
  providedIn: 'root'
})
export class EMMACorpGuard implements CanActivate {

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly authGuard: AuthGuard,
    private readonly hasRoleGuard: HasRoleGuard,
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const menuRoute = this.menuEmitterService.menuRoutes.find(r => r.value === route.url[0].path);
    if (this.menuEmitterService.menuNoRole.findIndex(m => m === menuRoute?.key) > 0) {
      return true;
    } else {
      return this.authGuard.canActivate(route, state).pipe(tap(() => this.hasRoleGuard.canActivate(route, state)));
    }
  }
}
