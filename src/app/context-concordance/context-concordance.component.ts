import { Component, Input, OnInit } from '@angular/core';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { KeyValueItem } from '../model/key-value-item';

@Component({
  selector: 'app-context-concordance',
  templateUrl: './context-concordance.component.html',
  styleUrls: ['./context-concordance.component.scss']
})
export class ContextConcordanceComponent implements OnInit {

  @Input() public contextConcordanceQueryRequest: ContextConcordanceQueryRequest | null = null;

  public windows: KeyValueItem[] = [new KeyValueItem('LEFT', 'LEFT'), new KeyValueItem('RIGHT', 'RIGHT'), new KeyValueItem('BOTH', 'BOTH')];
  public selectedWindow: KeyValueItem | null = null;
  public items: KeyValueItem[] = [new KeyValueItem('ALL', 'ALL'), new KeyValueItem('ANY', 'ANY'), new KeyValueItem('NONE', 'NONE')];
  public selectedItem: KeyValueItem | null = null;
  public tokens: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedToken: KeyValueItem | null = null;

  constructor() { }

  ngOnInit(): void {

    for (let i = 1; i < 6; i++) {
      this.tokens.push(new KeyValueItem('' + i, '' + i));
    }
    this.tokens.push(new KeyValueItem('7', '7'));
    this.tokens.push(new KeyValueItem('10', '10'));
    this.tokens.push(new KeyValueItem('15', '15'));
    if (this.contextConcordanceQueryRequest) {
      this.contextConcordanceQueryRequest.token = this.tokens[4];
    }
  }

}
