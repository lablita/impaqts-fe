import { NODE, WORD } from '../common/frequency-constants';
import { KeyValueItem } from './key-value-item';

export class FreqOption {
  level = false;
  attribute = WORD;
  ignoreCase = false;
  position = NODE;
}
export class FreqOptionsQueryRequest {
  freqLimit = 0;
  freqLimitMulti = 0;
  includeCat = false;
  categories: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  levelSelected = 0;
  freqOptionList: Array<FreqOption> = Array.from<FreqOption>({ length: 0 });

  public static getInstance(): FreqOptionsQueryRequest {
    const freqOptionsQueryRequest = new FreqOptionsQueryRequest();
    for (let i = 0; i <= 3; i++) {
      const freqOption = new FreqOption();
      freqOptionsQueryRequest.freqOptionList.push(freqOption);
    }
    return freqOptionsQueryRequest;
  }
}



