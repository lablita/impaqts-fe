export class ChunkToken {
  uid: number;
  type: string;
  action: string;
  value: string;

  constructor() {
    this.uid = Date.now();
  }
}