import { QueryElement } from "./query-element";
import { QueryTag } from "./query-tag";
export class QueryToken extends QueryElement {
  sentenceStart = false;
  sentenceEnd = false;
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


