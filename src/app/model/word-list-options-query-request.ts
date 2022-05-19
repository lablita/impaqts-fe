export class WordListOptionsQueryRequest {
  subcoprpus: string | null;
  searchAttribute: string | null;
  useNGrams: boolean;
  value: number;
  regexp: string | null;
  minFreq: number;
  maxFreq: number;
  whitelist: string | null;
  blacklist: string | null;
  nonWords: boolean;
  freqFigure: string | null;
  outputType: string | null;
  refSubCorpus: string | null;
  refSubCorpusDet: string | null;
  commonWords: number;
  changeOutFirst: string | null;
  changeOutSecond: string | null;
  changeOutThird: string | null;

  constructor(
    subcoprpus: string | null,
    searchAttribute: string | null,
    useNGrams: boolean,
    value: number,
    regexp: string | null,
    minFreq: number,
    maxFreq: number,
    whitelist: string | null,
    blacklist: string | null,
    nonWords: boolean,
    freqFigure: string | null,
    outputType: string | null,
    refSubCorpus: string | null,
    refSubCorpusDet: string | null,
    commonWords: number,
    changeOutFirst: string | null,
    changeOutSecond: string | null,
    changeOutThird: string | null
  ) {
    this.subcoprpus = subcoprpus;
    this.searchAttribute = searchAttribute;
    this.useNGrams = useNGrams;
    this.value = value;
    this.regexp = regexp;
    this.minFreq = minFreq;
    this.maxFreq = maxFreq;
    this.whitelist = whitelist;
    this.blacklist = blacklist;
    this.nonWords = nonWords;
    this.freqFigure = freqFigure;
    this.outputType = outputType;
    this.refSubCorpus = refSubCorpus;
    this.refSubCorpusDet = refSubCorpusDet;
    this.commonWords = commonWords;
    this.changeOutFirst = changeOutFirst;
    this.changeOutSecond = changeOutSecond;
    this.changeOutThird = changeOutThird;
  }

  public static getInstance(): WordListOptionsQueryRequest {
    return new WordListOptionsQueryRequest(null, null, false, 0, null, 0, 0, null, null,
      false, null, null, null, null, 0, null, null, null);
  }

}
