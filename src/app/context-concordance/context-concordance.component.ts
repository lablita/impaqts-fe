import { Component, Input, OnInit } from '@angular/core';
import { ContextConcordanceItem, ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { QueryRequestService } from '../services/query-request.service';

const WINDOWS = [
  'LEFT',
  'RIGHT',
  'BOTH',
];

const ITEMS = [
  'ALL',
  'ANY',
  'NONE',
];

const TOKENS = [1, 2, 3, 4, 5, 7, 10, 15];




@Component({
  selector: 'app-context-concordance',
  templateUrl: './context-concordance.component.html',
  styleUrls: ['./context-concordance.component.scss']
})
export class ContextConcordanceComponent implements OnInit {

  @Input() public panel = false;

  public windows: Array<string> = [];
  public items: Array<string> = [];
  public tokens: number[] = Array.from<number>({ length: 0 });

  constructor(
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.windows = WINDOWS;
    this.items = ITEMS;
    this.tokens = TOKENS;
    this.queryRequestService.clearContextConcordanceQueryRequest();
    const cci = ContextConcordanceItem.getInstance();
    this.queryRequestService.getContextConcordanceQueryRequest().items.push(cci);
  }

  get contextConcordanceQueryRequest(): ContextConcordanceQueryRequest {
    return this.queryRequestService.getContextConcordanceQueryRequest();
  }

}
