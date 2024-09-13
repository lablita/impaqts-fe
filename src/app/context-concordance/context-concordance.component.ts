import { Component, Input, OnInit } from '@angular/core';
import { CONTEXT_TYPE_ALL, CONTEXT_TYPE_ANY, CONTEXT_TYPE_NONE, CONTEXT_WINDOW_BOTH, CONTEXT_WINDOW_LEFT, CONTEXT_WINDOW_RIGHT } from '../common/concordance-constants';
import { ContextConcordanceItem, ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { QueryRequestService } from '../services/query-request.service';

const WINDOWS = [
  CONTEXT_WINDOW_LEFT,
  CONTEXT_WINDOW_RIGHT,
  CONTEXT_WINDOW_BOTH,
];

const ITEMS = [
  CONTEXT_TYPE_ALL,
  CONTEXT_TYPE_ANY,
  CONTEXT_TYPE_NONE,
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
  public tokens: number[] = [];

  constructor(
    public readonly queryRequestService: QueryRequestService
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
