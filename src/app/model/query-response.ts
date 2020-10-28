import { KWICline } from './kwicline';

export class QueryResponse {
  kwicLines: Array<KWICline>;
  inProgress: boolean;
  currentSize: number;
}
