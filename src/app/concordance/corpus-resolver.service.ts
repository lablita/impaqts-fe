import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Corpus } from '../model/dropdown-item';
import { ConcordanceService } from './concordance.service';

@Injectable({
  providedIn: 'root'
})
export class CorpusResolverService implements Resolve<Corpus[]> {

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Corpus[]> {
    return this.concordanceService.getCorpus();
  }

}
