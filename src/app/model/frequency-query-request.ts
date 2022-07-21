export class FrequencyOption {
  attribute: string | null = null;
  ignoreCase: boolean | null = null;
  position: string | null = null;
}
export class FrequencyQueryRequest {
  frequencyLimit = 0;
  includeCategoriesWithNoHits: boolean | null = null;
  frequencyColSort: string | null = null;
  frequencyTypeSort: string | null = null;
  categories: Array<string> = Array.from<string>({ length: 0 });
  category: string | null = null;
  multilevelFrequency: Array<FrequencyOption> = Array.from<FrequencyOption>({ length: 0 });
}
