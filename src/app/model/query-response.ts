import { KWICline } from './kwicline';

export class QueryResponse {
  kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  inProgress = false;
  currentSize = 0;
}
