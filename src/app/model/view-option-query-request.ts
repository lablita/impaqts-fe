import { WORD } from "../common/query-constants";

export class ViewOptionQueryRequest {
  attributes: string[] = [];

  constructor() {
    this.attributes = [WORD]
  }
}



