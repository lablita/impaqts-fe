import { CorpusShort } from './dropdown-item';
import { FreqOptionsQueryRequest } from './freq-options-query_request';
import { SortOptionsQueryRequest } from './sort-options-query-request';
import { ViewOptionsQueryRequest } from './view-options-query-request';
import { WordListOptionsQueryRequest } from './word-list-options-query-request';

export class Startup {
  corpusList: CorpusShort[];
  viewOptionsQueryRequest: ViewOptionsQueryRequest;
  wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  sortOptionsQueryRequest: SortOptionsQueryRequest;
  freqOptionsQueryRequest: FreqOptionsQueryRequest;

  constructor(
    corpusList: CorpusShort[],
    viewOptionsQueryRequest: ViewOptionsQueryRequest,
    wordListOptionsQueryRequest: WordListOptionsQueryRequest,
    sortOptionsQueryRequest: SortOptionsQueryRequest,
    freqOptionsQueryRequest: FreqOptionsQueryRequest
  ) {
    this.corpusList = corpusList;
    this.viewOptionsQueryRequest = viewOptionsQueryRequest;
    this.wordListOptionsQueryRequest = wordListOptionsQueryRequest;
    this.sortOptionsQueryRequest = sortOptionsQueryRequest;
    this.freqOptionsQueryRequest = freqOptionsQueryRequest;
  }
}
