import { TreeNode } from 'primeng/api';
import { Corpus } from './corpus';

export class Metadatum {

  id: number;
  name: string;
  documentMetadatum: boolean;
  position: number;
  subMetadata: Metadatum[] = [];
  parentMetadata: Metadatum;
  Metadatum: Metadatum;
  corpus: Corpus;
  multipleChoice: boolean;
  retrieveValuesFromCorpus: boolean;
  freeText: boolean;
  tree: TreeNode[] = [];
  parentMD = false;
  selection: TreeNode;
}
