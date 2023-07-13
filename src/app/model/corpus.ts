import { Installation } from './installation';
import { Metadatum } from './metadatum';

export class Corpus {
  id = 0;
  name = '';
  endpoint = '';
  secureUrl = false;
  metadata: Metadatum[] = [];
  installations: Installation[] = [];
}
