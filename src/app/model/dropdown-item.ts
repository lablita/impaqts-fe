export class DropdownItem {
  code: string;
  name: string;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

export class Corpus extends DropdownItem {

}