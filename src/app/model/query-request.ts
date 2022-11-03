import { CollocationQueryRequest } from "./collocation-query-request";
import { ContextConcordanceQueryRequest } from "./context-concordance-query-request";
import { FrequencyQueryRequest } from "./frequency-query-request";
import { QueryPattern } from "./query-pattern";
import { SortQueryRequest } from "./sort-query-request";
import { WideContextRequest } from "./wide-context-request";

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
  frequencyQueryRequest: FrequencyQueryRequest | null = null;
  contextConcordanceQueryRequest: ContextConcordanceQueryRequest | null = null;
  wideContextRequest: WideContextRequest | null = null;

}
