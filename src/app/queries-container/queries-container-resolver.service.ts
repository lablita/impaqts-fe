import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Installation } from '../model/installation';
import { QueriesContainerService } from '../queries-container/queries-container.service';

@Injectable({
  providedIn: 'root'
})
export class QueriesConteinerResolverService implements Resolve<Installation> {

  constructor(
    private readonly queriesConteinerService: QueriesContainerService
  ) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Installation> {
    const installation = new Installation();
    return this.queriesConteinerService.getInstallation().pipe(map(res => res === null ? installation : res));
  }

}
