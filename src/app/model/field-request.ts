import { ContextConcordanceQueryRequest } from './context-concordance-query-request';
import { KeyValueItem } from './key-value-item';
import { SortQueryRequest } from './sort-query-request';

export class FieldRequest {
  selectedCorpus: KeyValueItem | null = null;
  simpleResult = '';
  simple = '';
  lemma = '';
  phrase = '';
  word = '';
  character = '';
  cql = '';
  implicit = '';
  matchCase = false;
  selectedQueryType: string | null = null;
  contextConcordance: ContextConcordanceQueryRequest | null = null;
  quickSort?: SortQueryRequest | null = null;

  public static build(
    selectedCorpus: KeyValueItem | null, simpleResult: string, simple: string, lemma: string,
    phrase: string, word: string, character: string, cql: string,implicit: string, matchCase: boolean,
    selectedQueryType: string | null): FieldRequest {
    const fieldRequest = new FieldRequest();
    fieldRequest.selectedCorpus = selectedCorpus;
    fieldRequest.simpleResult = simpleResult;
    fieldRequest.simple = simple;
    fieldRequest.lemma = lemma;
    fieldRequest.phrase = phrase;
    fieldRequest.word = word;
    fieldRequest.character = character;
    fieldRequest.cql = cql;
    fieldRequest.implicit = implicit; 
    fieldRequest.matchCase = matchCase;
    fieldRequest.selectedQueryType = selectedQueryType;
    return fieldRequest;
  }
}
