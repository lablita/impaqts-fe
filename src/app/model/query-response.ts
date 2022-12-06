import { v4 as uuid } from 'uuid';
import { CollocationItem } from './collocation-item';
import { CorpusInfo } from './corpusinfo/corpus-info';
import { DescResponse } from './desc-response';
import { ErrorResponse } from './error-response';
import { FrequencyItem } from './frequency-item';
import { KWICline } from './kwicline';
import { WideContextResponse } from './wide-context-response';

export class QueryResponse {
  id = uuid();
  kwicLines: Array<KWICline> = [];
  collocations: Array<CollocationItem> = [];
  frequency: FrequencyItem = new FrequencyItem();
  descResponses: Array<DescResponse> = [];
  inProgress = false;
  currentSize = 0;
  errorMessage = '';
  wideContextResponse: WideContextResponse | null = null;
  corpusInfo: CorpusInfo | null = null;
  errorResponse: ErrorResponse | null = null;

  // not sent by BE
  error = false;
}
