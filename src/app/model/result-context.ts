export class ResultContext {
  keyword: string = ''
  before: string = '';
  after: string = '';

  constructor(keyword: string, before: string, after: string) {
    this.keyword = keyword;
    this.before = before;
    this.after = after;
  }
}