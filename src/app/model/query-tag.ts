
export class QueryTag {
  name = '';
  value = '';
  structure = '';
  startsWithValue = false;
  endsWithValue = false;
  containsValue = false;
  matchCase = false;
  negation = false;
  defaultAttributeCQL = '';
  position: string | null = null;
  regexp = false;
  noregexp = false;

  constructor(struct: string, name?: string, value?: string) {
    this.structure = struct;
    if (!!name) {
      this.name = name;
    }
    if (!!value) {
      this.value = value;
    }
  }
}
