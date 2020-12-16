export class Selection {
  key: string;
  value?: string;
  values?: string[] = [];

  constructor(key: string, value?: string, values?: string[]) {
    this.key = key;
    this.value = value;
    this.values = values;
  }
}
