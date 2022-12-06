import { v4 as uuid } from 'uuid';
import { REQUEST_TYPE } from '../common/query-constants';
import { CollocationQueryRequest } from './collocation-query-request';
import { ContextConcordanceQueryRequest } from './context-concordance-query-request';
import { FilterConcordanceQueryRequest } from './filter-concordance-query-request';
import { FrequencyQueryRequest } from './frequency-query-request';
import { QueryPattern } from './query-pattern';
import { SortQueryRequest } from './sort-query-request';
import { WideContextRequest } from './wide-context-request';

export class WordListOption {
  subcorpus = '';
  searchAttribute = '';
  nGrams = false;
}
export class QueryRequest {
  id = uuid();
  start = 0;
  end = 0;
  corpusMetadatum = '';
  word = '';
  corpus = '';
  cql = '';
  queryInCql = false;
  queryPattern: QueryPattern | null = null;
  collocationQueryRequest: CollocationQueryRequest | null = null;
  sortQueryRequest: SortQueryRequest | null = null;
  frequencyQueryRequest: FrequencyQueryRequest | null = null;
  contextConcordanceQueryRequest: ContextConcordanceQueryRequest | null = null;
  wideContextRequest: WideContextRequest | null = null;
  filterConcordanceQueryRequest: FilterConcordanceQueryRequest | null = null;


  queryType: REQUEST_TYPE = REQUEST_TYPE.TEXTUAL_QUERY_REQUEST;

}
