export class QueryElement {
  tags: Array<Array<QueryTag>> = [];

  constructor(struct: string) {
    const tag = new QueryTag(struct);
    const andTag: Array<QueryTag> = [];
    andTag.push(tag);
    this.tags.push(andTag);
  }
}

export class QueryTag {
  name: string;
  value: string;
  structure: 'token' | 'metadata';
  startsWithValue = false;
  endsWithValue = false;
  containsValue = false;
  matchCase = true;
  negation = false;

  constructor(struct: string) {
    this.structure = struct === 'token' ? 'token' : 'metadata';
  }
}
export class QueryToken extends QueryElement {
  sentenceStart: boolean;
  sentenceEnd: boolean;
  minRepetitions = 1;
  maxRepetitions = 1;

  addTag(andTag: Array<QueryTag>, struct: string): void {
    const tag = new QueryTag(struct);
    andTag.push(tag);
  }

  remove(tag: QueryTag, andTag: Array<QueryTag>): void {
    andTag.splice(andTag.indexOf(tag), 1);
    if (andTag.length === 0) {
      this.tags.splice(this.tags.indexOf(andTag), 1);
    }
  }

  addAndTag(struct: string): void {
    const tag = new QueryTag(struct);
    const andTag: Array<QueryTag> = [];
    andTag.push(tag);
    this.tags.push(andTag);
  }
}


