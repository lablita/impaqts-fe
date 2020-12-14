import { Corpus } from './corpus';

export class Metadatum {

  id: number;
  name: string;
  documentMetadatum: boolean;
  position: number;
  subMetadata: Metadatum[] = [];
  Metadatum: Metadatum;
  corpus: Corpus;
  multipleChoice: boolean;
  retrieveValuesFromCorpus: boolean;
}