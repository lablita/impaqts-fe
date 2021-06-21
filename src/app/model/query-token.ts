export class QueryElement {
  tags: Array<Array<QueryTag>> = [];

  constructor() {
    const tag = new QueryTag();
    const andTag: Array<QueryTag> = [];
    andTag.push(tag);
    this.tags.push(andTag);
  }
}

export class QueryTag {
  name: string;
  value: string;
  structure = 'token';
  startsWithValue = false;
  endsWithValue = false;
  containsValue = false;
  matchCase = true;
  negation = false;
}
export class QueryToken extends QueryElement {
  sentenceStart: boolean;
  sentenceEnd: boolean;
  minRepetitions = 1;
  maxRepetitions = 1;

  addTag(andTag: Array<QueryTag>): void {
    const tag = new QueryTag();
    andTag.push(tag);
  }

  remove(tag: QueryTag, andTag: Array<QueryTag>): void {
    andTag.splice(andTag.indexOf(tag), 1);
    if (andTag.length === 0) {
      this.tags.splice(this.tags.indexOf(andTag), 1);
    }
  }

  addAndTag(): void {
    const tag = new QueryTag();
    const andTag: Array<QueryTag> = [];
    andTag.push(tag);
    this.tags.push(andTag);
  }

}
