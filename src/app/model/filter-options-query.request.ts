import { KeyValueItem } from "./key-value-item";

export class FilterOptionsQueryRequest {
  filter: KeyValueItem;
  token: KeyValueItem;
  from: number;
  to: number;
  kwic: boolean;

  constructor(
    filter: KeyValueItem,
    token: KeyValueItem,
    from: number,
    to: number,
    kwic: boolean
  ) {
    this.filter = filter;
    this.token = token;
    this.from = from;
    this.to = to;
    this.kwic = kwic;
  }
}
