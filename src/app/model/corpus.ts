import { Installation } from './installation';
import { Metadatum } from './Metadatum';

export class Corpus {
  id: number;
  name: string;
  endpoint: string;
  metadata: Metadatum[] = [];
  installations: Installation[] = [];
}