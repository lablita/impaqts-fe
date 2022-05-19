import { QueryStructure } from './query-structure';
import { QueryToken } from './query-token';

export class QueryPattern {
  tokPattern: QueryToken[] = [];
  structPattern: QueryStructure = new QueryStructure();
}
