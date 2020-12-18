import { KeyValueItem } from "./key-value-item";

export class FreqOptionsQueryRequest {
  freqLimitMulti: number;
  level: string;
  attributes: string;
  ignoreCase: boolean;
  position: string;
  freqLimit: number;
  includeCat: boolean;
  categories: KeyValueItem[];

  constructor(
    freqLimitMulti: number,
    level: string,
    attributes: string,
    ignoreCase: boolean,
    position: string,
    freqLimit: number,
    includeCat: boolean,
    categories: KeyValueItem[],
  ) {
    this.freqLimitMulti = freqLimitMulti;
    this.level = level;
    this.attributes = attributes;
    this.ignoreCase = ignoreCase;
    this.position = position;
    this.freqLimit = freqLimit;
    this.includeCat = includeCat;
    this.categories = categories;
  }
}