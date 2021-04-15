import { Component, OnInit } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';
import { QueryToken } from '../model/query-token';

@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss']
})

export class VisualQueryComponent implements OnInit {

  public query: QueryToken[] = [];
  public typeListQuery: KeyValueItem[] = [new KeyValueItem('1', 'uno'), new KeyValueItem('2', 'due'), new KeyValueItem('3', 'tre')];
  public actionListQuery: KeyValueItem[] = [
    new KeyValueItem('IS', 'IS'),
    new KeyValueItem('IS_NOT', 'IS_NOT'),
    new KeyValueItem('BEGINS', 'BEGINS'),
    new KeyValueItem('CONTAINS', 'CONTAINS'),
    new KeyValueItem('ENDS', 'ENDS'),
    new KeyValueItem('REGEXP', 'REGEXP'),
    new KeyValueItem('NOT_REG', 'NOT_REG')];
  public optionList: KeyValueItem[] = [new KeyValueItem('1', 'repeat'), new KeyValueItem('2', 'sentence start'), new KeyValueItem('3', 'sentence end')];

  public metadata: QueryToken[] = [];
  public typeListMetadata: KeyValueItem[] = [new KeyValueItem('1', 'uno'), new KeyValueItem('2', 'due'), new KeyValueItem('3', 'tre')];
  public actionListMetadata: KeyValueItem[] = [new KeyValueItem('a', 'a'), new KeyValueItem('b', 'b'), new KeyValueItem('c', 'c')];


  constructor() { }

  ngOnInit(): void { }

  public addTokenQuery(): void {
    const token = new QueryToken();
    this.query.push(token);
  }

  public deleteTokenQuery(token: QueryToken): void {
    this.query.splice(this.query.indexOf(token), 1);
  }

  public addTokenMetadata(): void {
    const token = new QueryToken();
    this.metadata.push(token);
  }

  public deleteTokenMetadata(token: QueryToken): void {
    this.metadata.splice(this.query.indexOf(token), 1);
  }

}
