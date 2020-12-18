import { KeyValueItem } from "./key-value-item";

export class CollocationOptionsQueryRequest {
  attribute: KeyValueItem;
  rangeFrom: number;
  rangeTo: number;
  minFreqCorpus: number;
  minFreqRange: number;
  showFunc: KeyValueItem[];
  sortBy: KeyValueItem;

  constructor(
    attribute: KeyValueItem,
    rangeFrom: number,
    rangeTo: number,
    minFreqCorpus: number,
    minFreqRange: number,
    showFunc: KeyValueItem[],
    sortBy: KeyValueItem
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