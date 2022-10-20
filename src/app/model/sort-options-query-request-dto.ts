import { NODE, RIGHT_CONTEXT, WORD } from "../common/sort-constants";

export class SortOptionDTO {
  level: boolean;
  attribute: string;
  ignoreCase: boolean;
  backward: boolean;
  position: string;

  constructor(level: boolean, attribute: string, ignoreCase: boolean, backward: boolean, position: string) {
    this.level = level;
    this.attribute = attribute;
    this.ignoreCase = ignoreCase;
    this.backward = backward;
    this.position = position;
  }
}
export class SortOptionsQueryRequestDTO {
  attribute: string;
  sortKey: string;
  numberTokens: number;
  ignoreCase: boolean;
  backward: boolean;
  levelSelected: number;
  sortOptionList: Array<SortOptionDTO> = Array.from<SortOptionDTO>({ length: 0 });

  constructor(attribute: string, sortKey: string, numberTokens: number, ignoreCase: boolean,
    backward: boolean, levelSelected: number, sortOptionList: Array<SortOptionDTO>) {
    this.attribute = attribute;
    this.sortKey = sortKey;
    this.numberTokens = numberTokens;
    this.ignoreCase = ignoreCase;
    this.backward = backward;
    this.levelSelected = levelSelected;
    this.sortOptionList = sortOptionList;
  }
}

export const DEFAULT_SORT_OPTIONS_QUERY_REQUEST = new SortOptionsQueryRequestDTO(
  WORD,
  RIGHT_CONTEXT,
  3,
  false,
  false,
  1,
  [
    new SortOptionDTO(
      true,
      WORD,
      false,
      false,
      NODE),
    new SortOptionDTO(
      false,
      WORD,
      false,
      false,
      NODE),
    new SortOptionDTO(
      false,
      WORD,
      false,
      false,
      NODE)
  ]);


