import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KeyValueItem } from '../model/key-value-item';

@Injectable({
  providedIn: 'root'
})
export class CorpusSelectionService {

  public corpusSelectedSubject: Subject<KeyValueItem> = new Subject<KeyValueItem>();
  private selectedCorpus: KeyValueItem | null = null;
  private corpusChanged: boolean = false;
  private pageLoadedFirstTime: boolean = true;

  constructor() { }

  public getSelectedCorpus(): KeyValueItem | null {
    return this.selectedCorpus;
  }

  public setSelectedCorpus(corpus: KeyValueItem): void {
    const selectedCorpusStr = localStorage.getItem('selectedCorpus');
    if (!selectedCorpusStr || selectedCorpusStr && (JSON.parse(selectedCorpusStr) as KeyValueItem).key !== corpus?.key) {
      localStorage.setItem('selectedCorpus', JSON.stringify(corpus));
      this.corpusChanged = true;
    } else {
      this.corpusChanged = false;
    }
    this.selectedCorpus = corpus;
  }

  public getCorpusChanged(): boolean {
    return this.corpusChanged;
  }

  public resetCorpusChanged(): void {
    this.corpusChanged = false;
  }

  public setPageLoadedFirstTime(value: boolean): void {
    this.pageLoadedFirstTime = value;
  }

  public getPageLoadedFirstTime(): boolean {
    return this.pageLoadedFirstTime;
  }


}
