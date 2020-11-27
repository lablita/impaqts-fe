import { Corpus } from './dropdown-item';
import { ViewOptionQueryRequest } from './query-request';

export class Corpora {
  corpusList: Corpus[];
  viewOptionsQueryRequest: ViewOptionQueryRequest;

  constructor(corpusList: Corpus[], viewOptionsQueryRequest: ViewOptionQueryRequest) {
    this.corpusList = corpusList;
    this.viewOptionsQueryRequest = viewOptionsQueryRequest;
  }
}
