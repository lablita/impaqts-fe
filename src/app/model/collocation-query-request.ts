export class CollocationQueryRequest {
  attribute: string | null = '';
  rangeFrom: number | null = 0;
  rangeTo: number | null = 0;
  minFreqCorpus: number | null = 0;
  minFreqRange: number | null = 0;
  showFunc: string[] | null = [];
  sortBy: string | null = '';
  resultSize: number | null = 0;
}
