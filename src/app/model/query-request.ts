import { CollocationQueryRequest } from "./collocation-query-request";
import { QueryPattern } from "./query-pattern";
import { SortQueryRequest } from "./sort-query-request";

export class WordListOption {
  subcorpus = '';
  searchAttribute = '';
  nGrams = false;
}
export class QueryRequest {
  start = 0;
  end = 0;
  corpusMetadatum = '';
  word = '';
  corpus = '';
  cql = '';
  queryInCql = false;
  queryPattern: QueryPattern = new QueryPattern();
  collocationQueryRequest: CollocationQueryRequest | null = null;
  sortQueryRequest: SortQueryRequest | null = null;
}
