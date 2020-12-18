import { KeyValueItem } from "./key-value-item";

export class FreqOptionsQueryRequest {
  freqLimitMulti: number;
  level: KeyValueItem;
  attribute: KeyValueItem;
  ignoreCase: boolean;
  position: KeyValueItem;
  freqLimit: number;
  includeCat: boolean;
  categories: KeyValueItem[];

  constructor(
    freqLimitMulti: number,
    level: KeyValueItem,
    attribute: KeyValueItem,
    ignoreCase: boolean,
    position: KeyValueItem,
    freqLimit: number,
    includeCat: boolean,
    categories: KeyValueItem[],
  ) {
    this.freqLimitMulti = freqLimitMulti;
    this.level = level;
    this.attribute = attribute;
    this.ignoreCase = ignoreCase;
    this.position = position;
    this.freqLimit = freqLimit;
    this.includeCat = includeCat;
    this.categories = categories;
  }
}