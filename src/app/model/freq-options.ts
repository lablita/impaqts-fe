import { NODE, WORD } from '../common/frequency-constants';

export class FreqOption {
  level = false;
  attribute = WORD;
  ignoreCase = false;
  position = NODE;
}
export class FreqOptions {
  freqLimit = 0;
  freqLimitMulti = 0;
  includeCat = false;
  categories: Array<string> = Array.from<string>({ length: 0 });
  levelSelected = 0;
  freqOptionList: Array<FreqOption> = Array.from<FreqOption>({ length: 0 });

  public static build(): FreqOptions {
    const freqOptionsQueryRequest = new FreqOptions();
    for (let i = 0; i <= 3; i++) {
      const freqOption = new FreqOption();
      freqOptionsQueryRequest.freqOptionList.push(freqOption);
    }
    return freqOptionsQueryRequest;
  }
}



