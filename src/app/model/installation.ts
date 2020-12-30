import { Corpus } from './corpus';
import { Logo } from './logo';
export class Installation {
  id: number;
  projectName: string;
  projectSubTitle: string;
  corpora: Corpus[] = [];
  logos: Logo[] = [];
  credits: string;
  copyrights: string;
}
