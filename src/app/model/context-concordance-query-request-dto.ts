import { KeyValueItem } from './key-value-item';

export class ContextConcordanceQueryRequestDTO {
  window: KeyValueItem;
  token: number;
  lemma: string;
  item: KeyValueItem;

  constructor(
    window: KeyValueItem,
    token: number,
    lemma: string,
    item: KeyValueItem,
  ) {
    this.window = window;
    this.token = token;
    this.lemma = lemma;
    this.item = item;
  }

  public static getInstance(): ContextConcordanceQueryRequestDTO {
    return new ContextConcordanceQueryRequestDTO(new KeyValueItem('BOTH', 'BOTH'), 5, '', new KeyValueItem('ALL', 'ALL'));
  }
}
