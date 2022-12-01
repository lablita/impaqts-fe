export class SortOption {
  attribute: string | null = null;
  ignoreCase: boolean | null = null;
  backward: boolean | null = null;
  position: string | null = null;
}
export class SortQueryRequest {
  attribute: string | null = null;
  sortKey: string | null = null;
  numberTokens = 0;
  ignoreCase: boolean | null = null;
  backward: boolean | null = null;
  multilevelSort: Array<SortOption> = [];
  multilevel = false;
}
