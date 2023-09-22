import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyValueItem } from '../model/key-value-item';

@Injectable({
  providedIn: 'root'
})
export class CorpusSelectionService {

  public corpusSelectedSubject: BehaviorSubject<KeyValueItem | null> = new BehaviorSubject<KeyValueItem | null>(null);

  constructor() { }
}
