import { ViewOptionsQueryRequest } from './view-options-query-request';

export class WordListOption {
  subcorpus: string;
  searchAttribute: string;
  nGrams: boolean;
}
export class QueryRequest {
  start: number;
  end: number;
  word: string;
  viewOptionQueryRequest: ViewOptionsQueryRequest;
  wordListOption: WordListOption;


}
