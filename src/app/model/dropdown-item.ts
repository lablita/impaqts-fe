export class DropdownItem {
  code: string;
  name: string;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

export class CorpusShort extends DropdownItem {
  constructor(code: string, name: string) {
    super(code, name);
  }
}
