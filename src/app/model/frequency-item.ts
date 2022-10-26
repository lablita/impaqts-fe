import { FrequencyResultLine } from "./frequency-result-line";

export class FrequencyItem {
  head: string | null = null;
  total = 0;
  totalFreq = 0;
  maxFreq = 0;
  maxRel = 0;
  items: Array<FrequencyResultLine> = Array.from<FrequencyResultLine>({ length: 0 });
}
