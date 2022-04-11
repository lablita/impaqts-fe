export class SortQueryRequest {
  attribute = '';
  sortKey = '';
  numberTokens = '';
  ignoreCase = false;
  backward = false;
  levels: string[] = [];
  attributeMulti: string[] = [];
  ignoreCaseMulti: boolean[] = [];
  backwardMulti: boolean[] = [];
  position: string[] = [];
}
