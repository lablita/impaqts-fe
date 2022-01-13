import { QueryTag } from "./query-tag";

export class QueryElement {
  tags: Array<Array<QueryTag>> = [];

  constructor(struct?: string) {
    if (struct) {
      const tag = new QueryTag(struct);
      const andTag: Array<QueryTag> = [];
      andTag.push(tag);
      this.tags.push(andTag);
    }
  }
}
