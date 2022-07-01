import { CollocationOptionsQueryRequestDTO } from './collocation-options-query-request-dto';
import { FilterOptionsQueryRequest } from './filter-options-query-request-dto';
import { FreqOptionsQueryRequestDTO } from './freq-options-query-request-dto';
import { KeyValueItem } from './key-value-item';
import { SortOptionsQueryRequestDTO } from './sort-options-query-request-dto';
import { ViewOptionsQueryRequest } from './view-options-query-request';
import { WordListOptionsQueryRequest } from './word-list-options-query-request';

export class Startup {
  corpusList: KeyValueItem[];
  viewOptionsQueryRequest: ViewOptionsQueryRequest;
  wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  sortOptionsQueryRequest: SortOptionsQueryRequestDTO;
  freqOptionsQueryRequest: FreqOptionsQueryRequestDTO;
  collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO;
  filterOptionsQueryRequest: FilterOptionsQueryRequest;

  constructor(
    corpusList: KeyValueItem[],
    viewOptionsQueryRequest: ViewOptionsQueryRequest,
    wordListOptionsQueryRequest: WordListOptionsQueryRequest,
    sortOptionsQueryRequest: SortOptionsQueryRequestDTO,
    freqOptionsQueryRequest: FreqOptionsQueryRequestDTO,
    collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO,
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
