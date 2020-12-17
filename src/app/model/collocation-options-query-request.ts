export class CollocationOptionsQueryRequest {
  attributes: string;
  rangeFrom: number;
  rangeTo: number;
  minFreqCorpus: number;
  minFreqRange: number;
  showFunc: string[];
  sortBy: string;

  constructor(
    attributes: string,
    rangeFrom: number,
    rangeTo: number,
    minFreqCorpus: number,
    minFreqRange: number,
    showFunc: string[],
    sortBy: string
  ) {
    this.attributes = attributes;
    this.rangeFrom = rangeFrom;
    this.rangeTo = rangeTo;
    this.minFreqCorpus = minFreqCorpus;
    this.minFreqRange = minFreqRange;
    this.showFunc = showFunc;
    this.sortBy = sortBy;
  }
}