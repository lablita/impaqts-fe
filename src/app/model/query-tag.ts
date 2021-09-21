import { STRUCT_DOC, TOKEN } from '../common/constants';


export class QueryTag {
  name: string = '';
  value: string = ''
  structure: 'token' | 'doc';
  startsWithValue = false;
  endsWithValue = false;
  containsValue = false;
  matchCase = true;
  negation = false;

  constructor(struct: string) {
    this.structure = struct === TOKEN ? TOKEN : STRUCT_DOC;
  }
}