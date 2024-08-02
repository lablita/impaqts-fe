
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
  label = '';

  constructor(struct: string, name?: string, value?: string) {
    this.structure = struct;
    if (!!name) {
      this.name = name;
    }
    if (!!value) {
      this.value = value;
    }
  }

  public resetTag(): void {
    this.startsWithValue = false;
    this.endsWithValue = false;
    this.containsValue = false;
    this.matchCase = false;
    this.negation = false;
    this.defaultAttributeCQL = '';
    this.position = null;
    this.regexp = false;
    this.noregexp = false;
  }
}
