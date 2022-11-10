import { POSITIVE } from '../common/filter-constants';
import { FIRST } from '../common/frequency-constants';
import { ContextConcordanceQueryRequest } from './context-concordance-query-request';
import { KeyValueItem } from './key-value-item';

export class FilterOptionsQueryRequestDTO {
  filter: string;
  token: string;
  from: number;
  to: number;
  kwic: boolean;
  contextConcordance?: ContextConcordanceQueryRequest;

  constructor(
    filter: string,
    token: string,
    from: number,
    to: number,
    kwic: boolean,
    contextConcordance?: ContextConcordanceQueryRequest
  ) {
    this.filter = filter;
    this.token = token;
    this.from = from;
    this.to = to;
    this.kwic = kwic;
    this.contextConcordance = contextConcordance;
  }

  public static getInstance(): FilterOptionsQueryRequestDTO {
    return new FilterOptionsQueryRequestDTO('', '', 0, 0, false);
  }
}

export const DEFAULT_FILTER_OPTIONS_QUERY_REQUEST = new FilterOptionsQueryRequestDTO(
  POSITIVE,
  FIRST,
  -5,
  5,
  false
);

