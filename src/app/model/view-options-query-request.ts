export class ViewOptionsQueryRequest {
  attributes: string[];
  structures: string[];
  references: string[];
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
    structures: string[],
    references: string[],
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
}