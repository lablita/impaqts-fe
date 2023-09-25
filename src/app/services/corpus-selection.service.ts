import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { KeyValueItem } from '../model/key-value-item';

@Injectable({
  providedIn: 'root'
})
export class CorpusSelectionService {

  private selectedCorpus: KeyValueItem | null = null;
  public corpusSelectedSubject: Subject<KeyValueItem> = new Subject<KeyValueItem>();

  constructor() { }

  public getSelectedCorpus(): KeyValueItem | null {
    return this.selectedCorpus;
  }

  public setSelectedCorpus(corpus: KeyValueItem): void {
    this.selectedCorpus = corpus;
  }
}
