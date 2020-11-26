export class QueryRequest {
  start: number;
  end: number;
  word: string;
  attributes: string[];
  structures: string[];
  references: string[];
  displayAttr: string[];
  asTooltip: string;
  pageSize: number;
  kwicContext: number;
  numLines: number;

}
