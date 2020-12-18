import { CollocationOptionsQueryRequest } from './collocation-options-query-request';
import { FreqOptionsQueryRequest } from './freq-options-query_request';
import { KeyValueItem } from './key-value-item';
import { SortOptionsQueryRequest } from './sort-options-query-request';
import { ViewOptionsQueryRequest } from './view-options-query-request';
import { WordListOptionsQueryRequest } from './word-list-options-query-request';

export class Startup {
  corpusList: KeyValueItem[];
  viewOptionsQueryRequest: ViewOptionsQueryRequest;
  wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  sortOptionsQueryRequest: SortOptionsQueryRequest;
  freqOptionsQueryRequest: FreqOptionsQueryRequest;
  collocationOptionsQueryRequest: CollocationOptionsQueryRequest;

  constructor(
    corpusList: KeyValueItem[],
    viewOptionsQueryRequest: ViewOptionsQueryRequest,
    wordListOptionsQueryRequest: WordListOptionsQueryRequest,
    sortOptionsQueryRequest: SortOptionsQueryRequest,
    freqOptionsQueryRequest: FreqOptionsQueryRequest,
    collocationOptionsQueryRequest: CollocationOptionsQueryRequest
  ) {
    this.corpusList = corpusList;
    this.viewOptionsQueryRequest = viewOptionsQueryRequest;
    this.wordListOptionsQueryRequest = wordListOptionsQueryRequest;
    this.sortOptionsQueryRequest = sortOptionsQueryRequest;
    this.freqOptionsQueryRequest = freqOptionsQueryRequest;
    this.collocationOptionsQueryRequest = collocationOptionsQueryRequest;
  }
}
