import { POSITIVE } from "../common/filter-constants";
import { FIRST } from "../common/frequency-constants";
import { ContextConcordanceQueryRequest } from "./context-concordance-query-request";
import { KeyValueItem } from "./key-value-item";

export class FilterOptionsQueryRequest {
  filter: KeyValueItem;
  token: KeyValueItem;
  from: number;
  to: number;
  kwic: boolean;
  contextConcordance?: ContextConcordanceQueryRequest;

  constructor(
    filter: KeyValueItem,
    token: KeyValueItem,
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

  public static getInstance(): FilterOptionsQueryRequest {
    return new FilterOptionsQueryRequest(new KeyValueItem('', ''), new KeyValueItem('', ''), 0, 0, false);
  }
}

export const DEFAULT_FILTER_OPTIONS_QUERY_REQUEST = new FilterOptionsQueryRequest(
  new KeyValueItem(POSITIVE, POSITIVE),
  new KeyValueItem(FIRST, FIRST),
  -5,
  5,
  false
);

