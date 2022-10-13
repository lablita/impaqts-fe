import { CollocationOptionsQueryRequestDTO } from './collocation-options-query-request-dto';
import { FilterOptionsQueryRequestDTO } from './filter-options-query-request-dto';
import { FreqOptions } from './freq-options';
import { KeyValueItem } from './key-value-item';
import { SortOptionsQueryRequestDTO } from './sort-options-query-request-dto';
import { ViewOptionsQueryRequest } from './view-options-query-request';
import { WordListOptionsQueryRequest } from './word-list-options-query-request';

export class Startup {
  corpusList: KeyValueItem[];
  viewOptionsQueryRequest: ViewOptionsQueryRequest;
  wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  sortOptionsQueryRequest: SortOptionsQueryRequestDTO;
  freqOptionsQueryRequest: FreqOptions;
  collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO;
  FilterOptionsQueryRequestDTO: FilterOptionsQueryRequestDTO;

  constructor(
    corpusList: KeyValueItem[],
    viewOptionsQueryRequest: ViewOptionsQueryRequest,
    wordListOptionsQueryRequest: WordListOptionsQueryRequest,
    sortOptionsQueryRequest: SortOptionsQueryRequestDTO,
    freqOptionsQueryRequest: FreqOptions,
    collocationOptionsQueryRequest: CollocationOptionsQueryRequestDTO,
    FilterOptionsQueryRequestDTO: FilterOptionsQueryRequestDTO
  ) {
    this.corpusList = corpusList;
    this.viewOptionsQueryRequest = viewOptionsQueryRequest;
    this.wordListOptionsQueryRequest = wordListOptionsQueryRequest;
    this.sortOptionsQueryRequest = sortOptionsQueryRequest;
    this.freqOptionsQueryRequest = freqOptionsQueryRequest;
    this.collocationOptionsQueryRequest = collocationOptionsQueryRequest;
    this.FilterOptionsQueryRequestDTO = FilterOptionsQueryRequestDTO;
  }
}
