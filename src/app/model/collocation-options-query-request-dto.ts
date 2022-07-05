
export class CollocationOptionsQueryRequestDTO {
  attribute: string | null;
  rangeFrom: number;
  rangeTo: number;
  minFreqCorpus: number;
  minFreqRange: number;
  showFunc: string[] | null;
  sortBy?: string | null = null;

  constructor(
    attribute: string | null,
    rangeFrom: number,
    rangeTo: number,
    minFreqCorpus: number,
    minFreqRange: number,
    showFunc: string[],
    sortBy?: string
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

export const DEFAULT_COLLOCATION_OPTIONS_QUERY_REQUEST = new CollocationOptionsQueryRequestDTO(
  null,
  -5,
  5,
  5,
  3,
  [
    'T_SCORE', 'MI', 'LOG_DICE'],
  'LOG_DICE');
