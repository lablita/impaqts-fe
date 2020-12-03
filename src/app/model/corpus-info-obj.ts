export class CorpusInfoObj {
  label: string;
  value: string;
  url?: string;

  constructor(label: string, value: string, url?: string) {
    this.label = label;
    this.value = value;
    this.url = url;
  }
}