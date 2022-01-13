import { TreeNode } from 'primeng/api';
import { Corpus } from './corpus';

export class Metadatum {
  id = 0;
  name = '';
  documentMetadatum = false;
  position = 0;
  subMetadata: Metadatum[] = [];
  parentMetadata: Metadatum | null = null;
  Metadatum: Metadatum | null = null;
  corpus: Corpus | null = null;
  multipleChoice = false;
  retrieveValuesFromCorpus = false;
  freeText = false;
  tree: TreeNode[] = [];
  parentMD = false;
  selection: string | TreeNode | TreeNode[] = '';
  selected = false;
  child = false;
}
