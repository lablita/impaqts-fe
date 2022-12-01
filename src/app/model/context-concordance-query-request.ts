import { CONTEXT_TYPE_ALL, CONTEXT_WINDOW_BOTH } from '../common/concordance-constants';
import { WORD } from '../common/query-constants';

export class ContextConcordanceItem {

  window: string;
  tokens: number;
  term: string;
  attribute: string; // WORD, LEMMA, ...
  lemmaFilterType: string;

  constructor(
    window: string,
    token: number,
    term: string,
    attribute: string,
    item: string,
  ) {
    this.window = window;
    this.tokens = token;
    this.term = term;
    this.attribute = attribute;
    this.lemmaFilterType = item;
  }

  public static getInstance(): ContextConcordanceItem {
    return new ContextConcordanceItem(CONTEXT_WINDOW_BOTH, 5, '', WORD, CONTEXT_TYPE_ALL);
  }

}

export class ContextConcordanceQueryRequest {
  items: Array<ContextConcordanceItem> = [];
}
