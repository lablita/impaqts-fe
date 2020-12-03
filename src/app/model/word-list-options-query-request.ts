export class WordListOptionsQueryRequest {
  subcoprpus: string;
  searchAttribute: string;
  useNGrams: boolean;
  valueOf: number;
  regexp: string;
  minFreq: number;
  maxFreq: number;
  whitelist: string;
  blacklist: string;
  nonWords: boolean;
  freqFigure: string;
  outputType: string;
  refSubCorpus: string;
  refSubCorpusDet: string;
  commonWords: number;
  changeOutFirst: string;
  changeOutSecond: string;
  changeOutThird: string;

  constructor(
    subcoprpus: string,
    searchAttribute: string,
    useNGrams: boolean,
    valueOf: number,
    regexp: string,
    minFreq: number,
    maxFreq: number,
    whitelist: string,
    blacklist: string,
    nonWords: boolean,
    freqFigure: string,
    outputType: string,
    refSubCorpus: string,
    refSubCorpusDet: string,
    commonWords: number,
    changeOutFirst: string,
    changeOutSecond: string,
    changeOutThird: string,
  ) {
    this.subcoprpus = subcoprpus;
    this.searchAttribute = searchAttribute;
    this.useNGrams = useNGrams;
    this.valueOf = valueOf;
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

}