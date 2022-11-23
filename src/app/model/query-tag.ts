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
  position: string | null = null;

  constructor(struct: string, name?: string, value?: string) {
    this.structure = struct === TOKEN ? TOKEN : STRUCT_DOC;
    if (!!name) this.name = name;
    if (!!value) this.value = value;
  }
}
