import { Installation } from './installation';
import { Metadatum } from './metadatum';

export class Corpus {
  id = 0;
  name = '';
  endpoint = '';
  metadata: Metadatum[] = [];
  installations: Installation[] = [];
}
