export class FrequencyOption {
  attribute: string | null = null;
  ignoreCase: boolean | null = null;
  position: string | null = null; // 1l , 2L... 3R...
  term: string | null = null;
}
export class FrequencyQueryRequest {
  frequencyLimit = 0;
  includeCategoriesWithNoHits: boolean | null = null;
  frequencyType: string | null = null;
  frequencyColSort: string | null = null;
  frequencyTypeSort: string | null = null;
  categories: Array<string> = [];
  category: string | null = null;
  freqOptList: Array<FrequencyOption> =[];
  positive = true;
}
