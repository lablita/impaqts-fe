import { OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH } from "./constants";
import { KeyValueItem } from "./key-value-item";

export class ViewOptionsQueryRequest {
  attributes: string[];
  structures: KeyValueItem[];
  references: KeyValueItem[];
  displayAttr: string;
  asTooltip: boolean;
  refsUp: boolean;
  pageSize: number;
  kwicContext: number;
  sortGood: boolean;
  showGDEX: boolean;
  numLines: number;
  iconForOne: boolean;
  allowMulti: boolean;
  flashCoping: boolean;
  checkSelLines: boolean;
  showLinesNum: boolean;
  shortLongRef: boolean;

  constructor(
    attributes: string[],
    structures: KeyValueItem[],
    references: KeyValueItem[],
    displayAttr: string,
    asTooltip: boolean,
    refsUp: boolean,
    pageSize: number,
    kwicContext: number,
    sortGood: boolean,
    showGDEX: boolean,
    numLines: number,
    iconForOne: boolean,
    allowMulti: boolean,
    flashCoping: boolean,
    checkSelLines: boolean,
    showLinesNum: boolean,
    shortLongRef: boolean,
  ) {
    this.attributes = attributes;
    this.structures = structures;
    this.references = references;
    this.displayAttr = displayAttr;
    this.asTooltip = asTooltip;
    this.refsUp = refsUp;
    this.pageSize = pageSize;
    this.kwicContext = kwicContext;
    this.sortGood = sortGood;
    this.showGDEX = showGDEX;
    this.numLines = numLines;
    this.iconForOne = iconForOne;
    this.allowMulti = allowMulti;
    this.flashCoping = flashCoping;
    this.checkSelLines = checkSelLines;
    this.showLinesNum = showLinesNum;
    this.shortLongRef = shortLongRef;
  }

  public static getInstance(): ViewOptionsQueryRequest {
    return new ViewOptionsQueryRequest(
      Array.from<string>({ length: 0 }),
      Array.from<KeyValueItem>({ length: 0 }), Array.from<KeyValueItem>({ length: 0 }),
      '', false, false, 0, 0, false, false, 0, false, false, false, false, false, false);
  }
}

export const DEFAULT_VIEW_OPTIONS_QUERY_REQUEST = new ViewOptionsQueryRequest(
  [],
  [],
  [],
  OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  false,
  false,
  20,
  40,
  false,
  false,
  100,
  false,
  false,
  false,
  false,
  false,
  false
);

