export class SortOption {
  attribute = '';
  ignoreCase = false;
  backward = false;
  position = '';
}
export class SortQueryRequest {
  attribute = '';
  sortKey = '';
  numberTokens = 0;
  ignoreCase = false;
  backward = false;
  multilevelSort: Array<SortOption> = Array.from<SortOption>({ length: 0 });
}
