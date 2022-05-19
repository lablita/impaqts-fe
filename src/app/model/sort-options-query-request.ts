import { KeyValueItem } from "./key-value-item";
export class SortOptionsQueryRequest {
  attribute: KeyValueItem;
  sortKey: KeyValueItem;
  numberTokens: number;
  ignoreCase: boolean;
  backward: boolean;
  levels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  attributeMulti: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  ignoreCaseMulti: Array<boolean> = Array.from<boolean>({ length: 0 });
  backwardMulti: Array<boolean> = Array.from<boolean>({ length: 0 });
  position: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  constructor(
    attribute: KeyValueItem,
    sortKey: KeyValueItem,
    numberTokens: number,
    ignoreCase: boolean,
    backward: boolean,
    levels: Array<KeyValueItem>,
    attributeMulti: Array<KeyValueItem>,
    ignoreCaseMulti: Array<boolean>,
    backwardMulti: Array<boolean>,
    position: Array<KeyValueItem>,
  ) {
    this.attribute = attribute;
    this.sortKey = sortKey;
    this.numberTokens = numberTokens;
    this.ignoreCase = ignoreCase;
    this.backward = backward;
    this.levels = levels;
    this.attributeMulti = attributeMulti;
    this.ignoreCaseMulti = ignoreCaseMulti;
    this.backwardMulti = backwardMulti;
    this.position = position;
  }
}
