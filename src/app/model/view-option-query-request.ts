import { WORD } from "../common/query-constants";

export class ViewOptionQueryRequest {
  attributesKwic: string[] = [];
  attributesCtx: string[] = [];

  constructor() {
    this.attributesKwic = [WORD];
    this.attributesCtx = [WORD]
  }
}



