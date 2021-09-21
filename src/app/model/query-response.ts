import { KWICline } from './kwicline';

export class QueryResponse {
  kwicLines: Array<KWICline> = new Array<KWICline>();
  inProgress: boolean = false;
  currentSize: number = 0;
}
