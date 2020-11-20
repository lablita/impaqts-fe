import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Corpus } from '../model/dropdown-item';

@Injectable({
  providedIn: 'root'
})
export class ConcordanceService {

  constructor() { }

  public getCorpus(): Observable<Corpus[]> {
    const corpusList = [
      new Corpus('1', 'AcWac EU'),
      new Corpus('2', 'Brexit IT'),
      new Corpus('3', 'DeWac Small'),
      new Corpus('4', 'DeWac Complete'),
      new Corpus('5', 'FrWac Complete'),
      new Corpus('6', 'EPIC int_es_en'),
      new Corpus('7', 'ItWac Small'),
      new Corpus('8', 'Repubblica')
    ];
    return of(corpusList);
  }
}
