import { NODE, NODE_CONTEXT, WORD } from "../common/sort-constants";

export class SortOptionDTO {
  level = false;
  attribute = WORD;
  ignoreCase = false;
  backward = false;
  position = NODE;
}
export class SortOptionsQueryRequestDTO {
  attribute = WORD;
  sortKey = NODE_CONTEXT;
  numberTokens = 0;
  ignoreCase = false;
  backward = false;
  levelSelected = 0;
  sortOptionList: Array<SortOptionDTO> = Array.from<SortOptionDTO>({ length: 0 });
  // levels: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  // attributeMulti: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  // ignoreCaseMulti: Array<boolean> = Array.from<boolean>({ length: 0 });
  // backwardMulti: Array<boolean> = Array.from<boolean>({ length: 0 });
  // position: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  constructor() { }
  public static build(): SortOptionsQueryRequestDTO {
    const sortOptionsQueryRequest = new SortOptionsQueryRequestDTO();
    for (let i = 0; i <= 2; i++) {
      const sortOption = new SortOptionDTO();
      sortOptionsQueryRequest.sortOptionList.push(sortOption);
    }
    return sortOptionsQueryRequest;
  }
}

// export const DEFAULT_SORT_OPTION_QUERY_REQUEST = SortOptionsQueryRequestDTO.build(
//   new KeyValueItem(WORD, WORD),
//   new KeyValueItem(LEFT, LEFT),
//   3,
//   false,
//   false,
//   [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL')],
//   [new KeyValueItem(WORD, WORD)],
//   [false, false, false],
//   [false, false, false],
//   [new KeyValueItem(NODE, NODE)],
// )
