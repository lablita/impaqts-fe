export const CONCORDANCE = 'CONCORDANCE';
export const SIMPLE = 'SIMPLE';
export const LEMMA = 'LEMMA';
export const PHRASE = 'PHRASE';
export const WORD = 'WORD';
export const CHARACTER = 'CHARACTER';
export const CQL = 'CQL';
export const TAG = 'TAG';
export const IMPLICIT = 'IMPLICIT';

export enum REQUEST_TYPE {
  VISUAL_QUERY_REQUEST = 'VISUAL_QUERY_REQUEST',
  TEXTUAL_QUERY_REQUEST = 'TEXTUAL_QUERY_REQUEST',
  CONTEXT_QUERY_REQUEST = 'CONTEXT_QUERY_REQUEST',
  COLLOCATION_REQUEST = 'COLLOCATION_REQUEST',
  SORT_REQUEST = 'SORT_REQUEST',
  MULTI_FREQUENCY_QUERY_REQUEST = 'MULTI_FREQUENCY_QUERY_REQUEST',
  METADATA_FREQUENCY_QUERY_REQUEST = 'METADATA_FREQUENCY_QUERY_REQUEST',
  PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST = 'PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST',
  PN_METADATA_FREQ_CONCORDANCE_QUERY_REQUEST = 'PN_METADATA_FREQ_CONCORDANCE_QUERY_REQUEST',
  WIDE_CONTEXT_QUERY_REQUEST = 'WIDE_CONTEXT_QUERY_REQUEST',
  FILTER_CONCORDACE_QUERY_REQUEST = 'FILTER_CONCORDACE_QUERY_REQUEST',
  WORD_LIST_REQUEST = 'WORD_LIST_REQUEST',
  IMPLICIT_REQUEST = 'IMPLICIT_REQUEST'
}
