import { NODE, WORD } from '../common/frequency-constants';

export class FreqOptionDTO {
  level = false;
  attribute = WORD;
  ignoreCase = false;
  position = NODE;
}
export class FreqOptionsQueryRequestDTO {
  freqLimit = 0;
  freqLimitMulti = 0;
  includeCat = false;
  categories: Array<string> = Array.from<string>({ length: 0 });
  levelSelected = 0;
  freqOptionList: Array<FreqOptionDTO> = Array.from<FreqOptionDTO>({ length: 0 });

  public static build(): FreqOptionsQueryRequestDTO {
    const freqOptionsQueryRequest = new FreqOptionsQueryRequestDTO();
    for (let i = 0; i <= 3; i++) {
      const freqOption = new FreqOptionDTO();
      freqOptionsQueryRequest.freqOptionList.push(freqOption);
    }
    return freqOptionsQueryRequest;
  }
}



