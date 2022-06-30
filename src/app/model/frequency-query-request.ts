export class FrequencyOption {
  attribute: string | null = null;
  ignoreCase: boolean | null = null;
  position: string | null = null;
}
export class FrequencyQueryRequest {
  frequencyLimit = 0;
  includeCategories: boolean | null = null;
  categories: Array<string> = Array.from<string>({ length: 0 });
  multilevelFrequency: Array<FrequencyOption> = Array.from<FrequencyOption>({ length: 0 });
}
