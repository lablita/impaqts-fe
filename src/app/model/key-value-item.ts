export class KeyValueItem {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

export class KeyValueItemExtended extends KeyValueItem{
  inactive: boolean;
  
  constructor(key: string, value: string, inactive: boolean) {
    super(key, value);
    this.inactive = inactive;
  }
}
