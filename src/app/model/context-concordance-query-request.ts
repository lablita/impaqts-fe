import { WORD } from '../common/query-constants';

export class ContextConcordanceItem {

  window: string;
  token: number;
  term: string;
  attribute: string; // WORD, LEMMA, ...
  item: string;

  constructor(
    window: string,
    token: number,
    term: string,
    attribute: string,
    item: string,
  ) {
    this.window = window;
    this.token = token;
    this.term = term;
    this.attribute = attribute;
    this.item = item;
  }

  public static getInstance(): ContextConcordanceItem {
    return new ContextConcordanceItem('BOTH', 5, '', WORD, 'ALL');
  }

}

export class ContextConcordanceQueryRequest {
  items: Array<ContextConcordanceItem> = [];
}
