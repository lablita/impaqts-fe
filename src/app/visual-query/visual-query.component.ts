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
  public typeList: KeyValueItem[] = [new KeyValueItem('1', 'uno'), new KeyValueItem('2', 'due'), new KeyValueItem('3', 'tre')];
  public actionList: KeyValueItem[] = [new KeyValueItem('a', 'a'), new KeyValueItem('b', 'b'), new KeyValueItem('c', 'c')];

  constructor() { }

  ngOnInit(): void {
  }

  public addToken(): void {
    const token = new QueryToken();
    this.query.push(token);
  }

  public deleteToken(token: QueryToken): void {
    this.query.splice(this.query.indexOf(token), 1);
  }

}
