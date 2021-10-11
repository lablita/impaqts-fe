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

  @Input() public contextConcordanceQueryRequest: ContextConcordanceQueryRequest | null = null;

  public windows: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedWindow: KeyValueItem | null = null;
  public items: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedItem: KeyValueItem | null = null;
  public tokens: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedToken: KeyValueItem | null = null;

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
    if (this.contextConcordanceQueryRequest) {
      this.contextConcordanceQueryRequest.token = this.tokens[4];
    }
    this.translateService.stream('PAGE.CONCORDANCE.LEFT').subscribe(res => {
      this.windows = [];
      this.windows.push(new KeyValueItem(LEFT, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.RIGHT').subscribe(res => this.windows.push(new KeyValueItem(RIGHT, res)));
    this.translateService.stream('PAGE.CONCORDANCE.BOTH').subscribe(res => {
      this.windows.push(new KeyValueItem(BOTH, res));
      if (this.contextConcordanceQueryRequest) {
        this.contextConcordanceQueryRequest.window = res;
      }
    });

    this.translateService.stream('PAGE.CONCORDANCE.ALL').subscribe(res => {
      this.items = [];
      this.items.push(new KeyValueItem(ALL, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.ANY').subscribe(res => this.items.push(new KeyValueItem(ANY, res)));
    this.translateService.stream('PAGE.CONCORDANCE.NONE').subscribe(res => {
      this.items.push(new KeyValueItem(NONE, res));
      if (this.contextConcordanceQueryRequest) {
        this.contextConcordanceQueryRequest.item = res;
      }
    });
  }

}
