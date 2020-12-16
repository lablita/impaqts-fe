import { Corpus } from './corpus';
export class Installation {
  id: number;
  displayName: string;
  name: string;
  corpora: Corpus[] = [];
}