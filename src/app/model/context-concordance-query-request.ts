
export class ContextConcordanceQueryRequest {
  window: string;
  token: number;
  lemma: string;
  item: string;

  constructor(
    window: string,
    token: number,
    lemma: string,
    item: string,
  ) {
    this.window = window;
    this.token = token;
    this.lemma = lemma;
    this.item = item;
  }
}
