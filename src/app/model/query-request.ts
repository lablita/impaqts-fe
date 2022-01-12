import { QueryPattern } from "./query-pattern";

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
}
