import { CollocationItem } from './collocation-item';
import { DescResponse } from './desc-response';
import { FrequencyItem } from './frequency-item';
import { KWICline } from './kwicline';

export class QueryResponse {
  kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  frequency: FrequencyItem = new FrequencyItem();
  descResponses: Array<DescResponse> = Array.from<DescResponse>({ length: 0 });
  inProgress = false;
  currentSize = 0;
}
