export class ResultContext {
  keyword = '';
  before = '';
  after = '';

  constructor(keyword: string, before: string, after: string) {
    this.keyword = keyword;
    this.before = before;
    this.after = after;
  }
}
