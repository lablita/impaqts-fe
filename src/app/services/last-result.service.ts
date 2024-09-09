import { Injectable } from '@angular/core';
import { LastResult } from './dto/last-result';

@Injectable({
  providedIn: 'root',
})
export class LastResultService {
  private lastResult = new LastResult([]);
  private queryTitle = '';
  constructor() { }

  public setLastResult(lastResult: LastResult): void {
    this.lastResult = lastResult;
  }

  public getLastResult(): LastResult {
    return this.lastResult;
  }

  public resetLastResult(): void {
    this.lastResult = new LastResult([]);
  }

  public setQueryTitle(queryTitle: string) {
    this.queryTitle = queryTitle;
  }

  public getQueryTitle(): string {
    return this.queryTitle;
  }
}
