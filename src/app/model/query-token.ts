import { QueryElement } from "./query-element";
import { QueryTag } from "./query-tag";
export class QueryToken extends QueryElement {
  sentenceStart = false;
  sentenceEnd = false;
  minRepetitions = 1;
  maxRepetitions = 1;

  addOrTag(orTags: Array<QueryTag>, struct: string): void {
    const tag = new QueryTag(struct);
    orTags.push(tag);
  }

  remove(tag: QueryTag, orTags: Array<QueryTag>): void {
    orTags.splice(orTags.indexOf(tag), 1);
    if (orTags.length === 0) {
      this.tags.splice(this.tags.indexOf(orTags), 1);
    }
  }

  addAndTag(struct: string): void {
    const tag = new QueryTag(struct);
    const orTags: Array<QueryTag> = [];
    orTags.push(tag);
    this.tags.push(orTags);
  }
}


