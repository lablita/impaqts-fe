import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ALL, ANY, BOTH, LEFT, NONE, RIGHT } from '../model/constants';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { KeyValueItem } from '../model/key-value-item';

@Component({
  selector: 'app-context-concordance',
  templateUrl: './context-concordance.component.html',
  styleUrls: ['./context-concordance.component.scss']
})
export class ContextConcordanceComponent implements OnInit {

  @Input() public contextConcordanceQueryRequest: ContextConcordanceQueryRequest;

  public windows: KeyValueItem[];
  public selectedWindow: KeyValueItem;
  public items: KeyValueItem[];
  public selectedItem: KeyValueItem;
  public tokens: KeyValueItem[] = [];
  public selectedToken: KeyValueItem;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {

    for (let i = 1; i < 6; i++) {
      this.tokens.push(new KeyValueItem('' + i, '' + i));
    }
    this.tokens.push(new KeyValueItem('7', '7'));
    this.tokens.push(new KeyValueItem('10', '10'));
    this.tokens.push(new KeyValueItem('15', '15'));
    this.contextConcordanceQueryRequest.token = this.tokens[4];

    this.translateService.stream('PAGE.CONCORDANCE.LEFT').subscribe(res => {
      this.windows = [];
      this.windows.push(new KeyValueItem(LEFT, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.RIGHT').subscribe(res => this.windows.push(new KeyValueItem(RIGHT, res)));
    this.translateService.stream('PAGE.CONCORDANCE.BOTH').subscribe(res => {
      this.windows.push(new KeyValueItem(BOTH, res));
      this.contextConcordanceQueryRequest.window = res;
    });

    this.translateService.stream('PAGE.CONCORDANCE.ALL').subscribe(res => {
      this.items = [];
      this.items.push(new KeyValueItem(ALL, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.ANY').subscribe(res => this.items.push(new KeyValueItem(ANY, res)));
    this.translateService.stream('PAGE.CONCORDANCE.NONE').subscribe(res => {
      this.items.push(new KeyValueItem(NONE, res));
      this.contextConcordanceQueryRequest.item = res;
    });
  }

}
