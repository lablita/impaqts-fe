import { ChunkToken } from "./chunk-token";

export class AndChunkToken {
  orChunkList: ChunkToken[] = [];

  constructor() {
    const chunk = new ChunkToken();
    this.orChunkList.push(chunk);
  }
}

export class QueryToken {
  sentenceStart: boolean;
  sentenceEnd: boolean;
  repeatIndex: number;
  repeatTimes: number;
  andChunkList: AndChunkToken[] = [];

  addOrChunk(andToken: AndChunkToken): void {
    const orChunk = new ChunkToken();
    andToken.orChunkList.push(orChunk);
  }

  remove(chunk: ChunkToken, andToken: AndChunkToken): void {
    andToken.orChunkList.splice(andToken.orChunkList.indexOf(chunk), 1);
    if (andToken.orChunkList.length === 0) {
      this.andChunkList.splice(this.andChunkList.indexOf(andToken), 1);
    }
  }

  addAndChunk(): void {
    const andChunkToken = new AndChunkToken();
    this.andChunkList.push(andChunkToken);
  }

  constructor() {
    this.addAndChunk();
  }

}
