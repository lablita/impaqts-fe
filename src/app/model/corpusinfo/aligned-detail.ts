import { PosItem } from './pos-item';

export class AlignedDetail {
  name = '';
  languageName = '';
  wposlist: Array<PosItem> = [];
  lopslist: Array<PosItem> = [];
  hasCase = false;
  hasLemma = false;
  tagsetdoc = '';
}
