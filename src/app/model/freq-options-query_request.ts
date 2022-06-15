import { FIRST, NODE, WORD } from '../common/frequency-constants';
import { KeyValueItem } from './key-value-item';

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

  public static getInstance(): FreqOptionsQueryRequest {
    return new FreqOptionsQueryRequest(0, new KeyValueItem('', ''),
      new KeyValueItem('', ''), false, new KeyValueItem('', ''), 0, false, Array.from<KeyValueItem>({ length: 0 }));
  }
}

export const DEFAULT_FREQUENCY_QUERY_REQUEST = new FreqOptionsQueryRequest(
  0,
  new KeyValueItem(FIRST, FIRST),
  new KeyValueItem(WORD, WORD),
  false,
  new KeyValueItem(NODE, NODE),
  0,
  false,
  []
);

