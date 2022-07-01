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
