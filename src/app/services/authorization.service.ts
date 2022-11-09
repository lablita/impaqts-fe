import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';

const INSTALLATIONS_META_NAME = 'https://impaqts.eu.auth0.meta/installations';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private readonly authService: AuthService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) { }

  public loginWithRedirect(): void {
    this.authService.loginWithRedirect();
  }

  public logout(): void {
    this.authService.logout({
      returnTo: this.document.location.origin
    });
    localStorage.clear();
  }

  public checkInstallationAuthorization(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if (user && !this.canUserAccessInstallation(user)) {
          return false;
        }
        return true;
      })
    );
  }

  private canUserAccessInstallation(user: User): boolean {
    const allowedInstallations = user[INSTALLATIONS_META_NAME] as Array<number>;
    const installationItem = localStorage.getItem(INSTALLATION);
    if (installationItem && allowedInstallations && allowedInstallations.length > 0) {
      const installation = JSON.parse(installationItem) as Installation;
      return allowedInstallations.findIndex(ai => ai === installation.id) >= 0;
    }
    return false;
  }
}
