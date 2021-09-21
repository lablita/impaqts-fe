import { QueryPattern } from "./query-pattern";

export class WordListOption {
  subcorpus: string = '';
  searchAttribute: string = '';
  nGrams: boolean = false;
}
export class QueryRequest {
  start: number = 0;
  end: number = 0;
  corpusMetadatum: string = '';
  word: string = '';
  corpus: string = '';
  cql: string = '';
  queryInCql: boolean = false;
  queryPattern: QueryPattern = new QueryPattern();
}
