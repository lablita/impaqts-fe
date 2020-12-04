export class SortOptionsQueryRequest {
  attributes: string;
  sortKey: string;
  numberTokens: number;
  ignoreCase: boolean;
  backward: boolean;
  level: string;
  attributesMulti: string;
  ignoreCaseMulti: boolean;
  backwardMulti: boolean;
  position: string;

  constructor(
    attributes: string,
    sortKey: string,
    numberTokens: number,
    ignoreCase: boolean,
    backward: boolean,
    level: string,
    attributesMulti: string,
    ignoreCaseMulti: boolean,
    backwardMulti: boolean,
    position: string,
  ) {
    this.attributes = attributes;
    this.sortKey = sortKey;
    this.numberTokens = numberTokens;
    this.ignoreCase = ignoreCase;
    this.backward = backward;
    this.level = level;
    this.attributesMulti = attributesMulti;
    this.ignoreCaseMulti = ignoreCaseMulti;
    this.backwardMulti = backwardMulti;
    this.position = position;
  }
}