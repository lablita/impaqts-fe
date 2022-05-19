import { KeyValueItem } from './key-value-item';

export class ContextConcordanceQueryRequest {
  window: KeyValueItem;
  token: KeyValueItem;
  lemma: string;
  item: KeyValueItem;

  constructor(
    window: KeyValueItem,
    token: KeyValueItem,
    lemma: string,
    item: KeyValueItem,
  ) {
    this.window = window;
    this.token = token;
    this.lemma = lemma;
    this.item = item;
  }

  public static getInstance(): ContextConcordanceQueryRequest {
    return new ContextConcordanceQueryRequest(new KeyValueItem('', ''), new KeyValueItem('', ''), '', new KeyValueItem('', ''));
  }
}
