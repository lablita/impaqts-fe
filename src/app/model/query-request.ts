import { QueryPattern } from "./query-pattern";

export class WordListOption {
  subcorpus: string;
  searchAttribute: string;
  nGrams: boolean;
}
export class QueryRequest {
  start: number;
  end: number;
  corpusMetadatum: string;
  word: string;
  corpus: string;
  cql: string;
  queryInCql: boolean;
  queryPattern: QueryPattern;
}
