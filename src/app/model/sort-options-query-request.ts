import { LEFT, NODE, WORD } from "../common/sort-constants";
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

export const DEFAULT_SORT_OPTION_QUERY_REQUEST = new SortOptionsQueryRequest(
  new KeyValueItem(WORD, WORD),
  new KeyValueItem(LEFT, LEFT),
  3,
  false,
  false,
  [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL')],
  [new KeyValueItem(WORD, WORD)],
  [false, false, false],
  [false, false, false],
  [new KeyValueItem(NODE, NODE)],
)
