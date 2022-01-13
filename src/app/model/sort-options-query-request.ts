import { KeyValueItem } from "./key-value-item";

export class SortOptionsQueryRequest {
  attribute: KeyValueItem;
  sortKey: KeyValueItem;
  numberTokens: number;
  ignoreCase: boolean;
  backward: boolean;
  level: KeyValueItem;
  attributeMulti: KeyValueItem;
  ignoreCaseMulti: boolean;
  backwardMulti: boolean;
  position: KeyValueItem;

  constructor(
    attribute: KeyValueItem,
    sortKey: KeyValueItem,
    numberTokens: number,
    ignoreCase: boolean,
    backward: boolean,
    level: KeyValueItem,
    attributeMulti: KeyValueItem,
    ignoreCaseMulti: boolean,
    backwardMulti: boolean,
    position: KeyValueItem,
  ) {
    this.attribute = attribute;
    this.sortKey = sortKey;
    this.numberTokens = numberTokens;
    this.ignoreCase = ignoreCase;
    this.backward = backward;
    this.level = level;
    this.attributeMulti = attributeMulti;
    this.ignoreCaseMulti = ignoreCaseMulti;
    this.backwardMulti = backwardMulti;
    this.position = position;
  }
}
