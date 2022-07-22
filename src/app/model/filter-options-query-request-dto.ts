import { POSITIVE } from "../common/filter-constants";
import { FIRST } from "../common/frequency-constants";
import { ContextConcordanceQueryRequestDTO } from "./context-concordance-query-request-dto";
import { KeyValueItem } from "./key-value-item";

export class FilterOptionsQueryRequestDTO {
  filter: KeyValueItem;
  token: KeyValueItem;
  from: number;
  to: number;
  kwic: boolean;
  contextConcordance?: ContextConcordanceQueryRequestDTO;

  constructor(
    filter: KeyValueItem,
    token: KeyValueItem,
    from: number,
    to: number,
    kwic: boolean,
    contextConcordance?: ContextConcordanceQueryRequestDTO
  ) {
    this.filter = filter;
    this.token = token;
    this.from = from;
    this.to = to;
    this.kwic = kwic;
    this.contextConcordance = contextConcordance;
  }

  public static getInstance(): FilterOptionsQueryRequestDTO {
    return new FilterOptionsQueryRequestDTO(new KeyValueItem('', ''), new KeyValueItem('', ''), 0, 0, false);
  }
}

export const DEFAULT_FILTER_OPTIONS_QUERY_REQUEST = new FilterOptionsQueryRequestDTO(
  new KeyValueItem(POSITIVE, POSITIVE),
  new KeyValueItem(FIRST, FIRST),
  -5,
  5,
  false
);

