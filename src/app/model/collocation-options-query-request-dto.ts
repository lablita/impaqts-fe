import { KeyValueItem } from "./key-value-item";

export class CollocationOptionsQueryRequestDTO {
  attribute: KeyValueItem | null;
  rangeFrom: number;
  rangeTo: number;
  minFreqCorpus: number;
  minFreqRange: number;
  showFunc: KeyValueItem[] | null;
  sortBy?: KeyValueItem;

  constructor(
    attribute: KeyValueItem | null,
    rangeFrom: number,
    rangeTo: number,
    minFreqCorpus: number,
    minFreqRange: number,
    showFunc: KeyValueItem[],
    sortBy?: KeyValueItem
  ) {
    this.attribute = attribute;
    this.rangeFrom = rangeFrom;
    this.rangeTo = rangeTo;
    this.minFreqCorpus = minFreqCorpus;
    this.minFreqRange = minFreqRange;
    this.showFunc = showFunc;
    this.sortBy = sortBy;
  }
}

export const DEFAULT_COLLOCATION_OPTIONS_QUERY_REQUEST = new CollocationOptionsQueryRequestDTO(null, -5, 5, 5, 3, []);
