import { Component, Input, OnInit } from '@angular/core';
import { ContextConcordanceQueryRequestDTO } from '../model/context-concordance-query-request-dto';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequestService } from '../services/query-request.service';

const WINDOWS = [
  new KeyValueItem('LEFT', 'LEFT'),
  new KeyValueItem('RIGHT', 'RIGHT'),
  new KeyValueItem('BOTH', 'BOTH')
];

const ITEMS = [
  new KeyValueItem('ALL', 'ALL'),
  new KeyValueItem('ANY', 'ANY'),
  new KeyValueItem('NONE', 'NONE')
];

const TOKENS = [1, 2, 3, 4, 5, 7, 10, 15];




@Component({
  selector: 'app-context-concordance',
  templateUrl: './context-concordance.component.html',
  styleUrls: ['./context-concordance.component.scss']
})
export class ContextConcordanceComponent implements OnInit {

  @Input() public panel = false;

  public windows: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedWindow: KeyValueItem | null = null;
  public items: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public selectedItem: KeyValueItem | null = null;
  public tokens: number[] = Array.from<number>({ length: 0 });
  public selectedToken: KeyValueItem | null = null;

  constructor(
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.windows = WINDOWS;
    this.items = ITEMS;
    this.tokens = TOKENS;
  }

  get contextConcordanceQueryRequest(): ContextConcordanceQueryRequestDTO {
    return this.queryRequestService.getContextConcordanceQueryRequestDTO();
  }

}
