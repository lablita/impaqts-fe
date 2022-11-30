import { POSITIVE } from '../common/filter-constants';
import { FIRST } from '../common/frequency-constants';
import { ContextConcordanceQueryRequest } from './context-concordance-query-request';

export class FilterConcordanceQueryRequest {
  filter: string;
  token: string;
  from: number;
  to: number;
  kwic: boolean;
  
  constructor(
    filter: string,
    token: string,
    from: number,
    to: number,
    kwic: boolean,
  ) {
    this.filter = filter;
    this.token = token;
    this.from = from;
    this.to = to;
    this.kwic = kwic;
  }

  public static getInstance(): FilterConcordanceQueryRequest {
    return new FilterConcordanceQueryRequest('', '', 0, 0, false);
  }
}

