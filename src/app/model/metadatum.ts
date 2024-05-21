import { TreeNode } from 'primeng/api';
import { Corpus } from './corpus';
import { MetadatumGroup } from './metadatum-group';

export class Metadatum {
  id = 0;
  name = '';
  documentMetadatum = false;
  position = 0;
  subMetadata: Metadatum[] = [];
  parentMetadatum: Metadatum | null = null;
  corpus: Corpus | null = null;
  multipleChoice = false;
  retrieveValuesFromCorpus = false;
  freeText = false;
  tree: TreeNode[] = [];
  parentMD = false;
  selection: string | TreeNode | TreeNode[] = '';
  selected = false;
  child = false;
  defaultAttribute = false;
  label= '';
  metadatumGroup: MetadatumGroup | null = null;
}
