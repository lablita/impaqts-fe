import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Installation } from '../model/installation';
import { ConcordanceService } from './concordance.service';

@Injectable({
  providedIn: 'root'
})
export class ConcordanceResolverService implements Resolve<Installation> {

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Installation> {
    return this.concordanceService.getInstallation();
  }

}
