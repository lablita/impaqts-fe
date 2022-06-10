import { CollocationItem } from "./collocation-item";
import { KWICline } from "./kwicline";

export class SocketResponse {
  kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  resultView = false;
  noResultFound = true;
  totalResults = 0;

  constructor(kwicLines: Array<KWICline>, collocations: Array<CollocationItem>, resultView: boolean,
    noResultFound: boolean, totalResults: number) {
    this.kwicLines = kwicLines;
    this.collocations = collocations;
    this.resultView = resultView;
    this.noResultFound = noResultFound;
    this.totalResults = totalResults;
  }
}