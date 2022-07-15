import { CollocationItem } from './collocation-item';
import { FrequencyItem } from './frequency-item';
import { KWICline } from './kwicline';

export class QueryResponse {
  kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  frequencies: Array<FrequencyItem> = Array.from<FrequencyItem>({ length: 0 });
  inProgress = false;
  currentSize = 0;
}
