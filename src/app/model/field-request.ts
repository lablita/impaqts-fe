import { ContextConcordanceQueryRequestDTO } from "./context-concordance-query-request-dto";
import { KeyValueItem } from "./key-value-item";
import { SortQueryRequest } from "./sort-query-request";

export class FieldRequest {
  selectedCorpus: KeyValueItem | null = null;
  simpleResult = '';
  simple = '';
  lemma = '';
  phrase = '';
  word = '';
  character = '';
  cql = '';
  matchCase = false;
  selectedQueryType: KeyValueItem | null = null;
  contextConcordance: ContextConcordanceQueryRequestDTO | null = null;
  quickSort?: SortQueryRequest | null = null;

  constructor() { }

  public static build(selectedCorpus: KeyValueItem | null, simpleResult: string, simple: string, lemma: string,
    phrase: string, word: string, character: string, cql: string, matchCase: boolean,
    selectedQueryType: KeyValueItem | null): FieldRequest {
    const fieldRequest = new FieldRequest();
    fieldRequest.selectedCorpus = selectedCorpus;
    fieldRequest.simpleResult = simpleResult;
    fieldRequest.simple = simple;
    fieldRequest.lemma = lemma;
    fieldRequest.phrase = phrase;
    fieldRequest.word = word;
    fieldRequest.character = character;
    fieldRequest.cql = cql;
    fieldRequest.matchCase = matchCase;
    fieldRequest.selectedQueryType = selectedQueryType;
    return fieldRequest;
  }
}