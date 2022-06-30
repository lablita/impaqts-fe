import { CollocationOptionsQueryRequest } from './collocation-options-query-request';
import { FilterOptionsQueryRequest } from './filter-options-query.request';
import { FreqOptionsQueryRequestDTO } from './freq-options-query_request';
import { KeyValueItem } from './key-value-item';
import { SortOptionsQueryRequestDTO } from './sort-options-query-request';
import { ViewOptionsQueryRequest } from './view-options-query-request';
import { WordListOptionsQueryRequest } from './word-list-options-query-request';

export class Startup {
  corpusList: KeyValueItem[];
  viewOptionsQueryRequest: ViewOptionsQueryRequest;
  wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  sortOptionsQueryRequest: SortOptionsQueryRequestDTO;
  freqOptionsQueryRequest: FreqOptionsQueryRequestDTO;
  collocationOptionsQueryRequest: CollocationOptionsQueryRequest;
  filterOptionsQueryRequest: FilterOptionsQueryRequest;

  constructor(
    corpusList: KeyValueItem[],
    viewOptionsQueryRequest: ViewOptionsQueryRequest,
    wordListOptionsQueryRequest: WordListOptionsQueryRequest,
    sortOptionsQueryRequest: SortOptionsQueryRequestDTO,
    freqOptionsQueryRequest: FreqOptionsQueryRequestDTO,
    collocationOptionsQueryRequest: CollocationOptionsQueryRequest,
    filterOptionsQueryRequest: FilterOptionsQueryRequest
  ) {
    this.corpusList = corpusList;
    this.viewOptionsQueryRequest = viewOptionsQueryRequest;
    this.wordListOptionsQueryRequest = wordListOptionsQueryRequest;
    this.sortOptionsQueryRequest = sortOptionsQueryRequest;
    this.freqOptionsQueryRequest = freqOptionsQueryRequest;
    this.collocationOptionsQueryRequest = collocationOptionsQueryRequest;
    this.filterOptionsQueryRequest = filterOptionsQueryRequest;
  }
}
