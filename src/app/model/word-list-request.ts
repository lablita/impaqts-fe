export class WordListRequest {
  subCoprpus: string | null;
  searchAttribute: string | null;
  useNGrams: boolean;
  nGramFrom: number;
  nGramTo: number;
  hideSubNGram: boolean;
  regexp: string | null;
  minFreq: number;
  maxFreq: number;
  whitelist: string | null;
  blacklist: string | null;
  nonWords: boolean;
  freqFigure: string | null;
  outputType: string | null;
  kwRefCorpus: string | null;
  kwRefSubCorpus: string | null;
  commonWords: number;
  changeOutFirst: string | null;
  changeOutSecond: string | null;
  changeOutThird: string | null;

  constructor(
    subCorpus: string | null,
    searchAttribute: string | null,
    useNGrams: boolean,
    nGramFrom: number,
    nGramTo: number,
    hideSubNGram: boolean,
    regexp: string | null,
    minFreq: number,
    maxFreq: number,
    whitelist: string | null,
    blacklist: string | null,
    nonWords: boolean,
    freqFigure: string | null,
    outputType: string | null,
    kwRefCorpus: string | null,
    kwRefSubCorpus: string | null,
    commonWords: number,
    changeOutFirst: string | null,
    changeOutSecond: string | null,
    changeOutThird: string | null
  ) {
    this.subCoprpus = subCorpus;
    this.searchAttribute = searchAttribute;
    this.useNGrams = useNGrams;
    this.nGramFrom = nGramFrom,
    this.nGramTo = nGramTo,
    this.hideSubNGram = hideSubNGram,
    this.regexp = regexp;
    this.minFreq = minFreq;
    this.maxFreq = maxFreq;
    this.whitelist = whitelist;
    this.blacklist = blacklist;
    this.nonWords = nonWords;
    this.freqFigure = freqFigure;
    this.outputType = outputType;
    this.kwRefCorpus = kwRefCorpus;
    this.kwRefSubCorpus = kwRefSubCorpus;
    this.commonWords = commonWords;
    this.changeOutFirst = changeOutFirst;
    this.changeOutSecond = changeOutSecond;
    this.changeOutThird = changeOutThird;
  }

  public static getInstance(): WordListRequest {
    return new WordListRequest(null, null, false, 0, 0, false, null, 0, 0, null, null,
      false, null, null, null, null, 0, null, null, null);
  }

}

export const DEFAULT_WORD_LIST_OPTION_QUERY_REQUEST = new WordListRequest(
  null,
  null,
  false,
  2,
  4,
  false,
  null,
  5,
  0,
  null,
  null,
  false,
  null,
  null,
  null,
  null,
  1,
  null,
  null,
  null
);
