import { KeyValueItem } from "./key-value-item";
export class SortOptionsQueryRequest {
  attribute: KeyValueItem = new KeyValueItem('', '');
  sortKey: KeyValueItem = new KeyValueItem('', '');
  numberTokens: number = 0;
  ignoreCase: boolean = false;
  backward: boolean = false;
  levels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  attributeMulti: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  ignoreCaseMulti: Array<boolean> = Array.from<boolean>({ length: 0 });
  backwardMulti: Array<boolean> = Array.from<boolean>({ length: 0 });
  position: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  constructor() { }
  public static build(
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
  ): SortOptionsQueryRequest {
    const sortOptionsQueryRequest = new SortOptionsQueryRequest();
    sortOptionsQueryRequest.attribute = attribute;
    sortOptionsQueryRequest.sortKey = sortKey;
    sortOptionsQueryRequest.numberTokens = numberTokens;
    sortOptionsQueryRequest.ignoreCase = ignoreCase;
    sortOptionsQueryRequest.backward = backward;
    sortOptionsQueryRequest.levels = levels;
    sortOptionsQueryRequest.attributeMulti = attributeMulti;
    sortOptionsQueryRequest.ignoreCaseMulti = ignoreCaseMulti;
    sortOptionsQueryRequest.backwardMulti = backwardMulti;
    sortOptionsQueryRequest.position = position;
    return sortOptionsQueryRequest;
  }
}
