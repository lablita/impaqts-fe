import { STRUCT_DOC, TOKEN } from '../common/constants';

export class QueryTag {
  name = '';
  value = '';
  structure: 'token' | 'doc';
  startsWithValue = false;
  endsWithValue = false;
  containsValue = false;
  matchCase = false;
  negation = false;
  defaultAttributeCQL = '';

  constructor(struct: string) {
    this.structure = struct === TOKEN ? TOKEN : STRUCT_DOC;
  }
}
