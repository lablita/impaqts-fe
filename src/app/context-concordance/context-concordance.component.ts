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

    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.windows = [
        new KeyValueItem(LEFT, this.translateService.instant('PAGE.CONCORDANCE.LEFT')),
        new KeyValueItem(RIGHT, this.translateService.instant('PAGE.CONCORDANCE.RIGHT')),
        new KeyValueItem(BOTH, this.translateService.instant('PAGE.CONCORDANCE.BOTH'))
      ];
      this.contextConcordanceQueryRequest.window = this.windows[2];

      this.items = [
        new KeyValueItem(ALL, this.translateService.instant('PAGE.CONCORDANCE.ALL')),
        new KeyValueItem(ANY, this.translateService.instant('PAGE.CONCORDANCE.ANY')),
        new KeyValueItem(NONE, this.translateService.instant('PAGE.CONCORDANCE.NONE'))
      ];
      this.contextConcordanceQueryRequest.item = this.items[0];
    });
  }

}
