import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChunkToken } from '../model/chunk-token';
import { KeyValueItem } from '../model/key-value-item';
import { AndChunkToken, QueryToken } from '../model/query-token';

@Component({
  selector: 'app-query-token',
  templateUrl: './query-token.component.html',
  styleUrls: ['./query-token.component.scss']
})
export class QueryTokenComponent implements OnInit {

  @Input() token: QueryToken;
  @Input() typeList: KeyValueItem[];
  @Input() actionList: KeyValueItem[];

  @Output() delete: EventEmitter<QueryToken> = new EventEmitter<QueryToken>();

  constructor() { }

  ngOnInit(): void {
  }

  public addOrChunk(andChunk: AndChunkToken): void {
    this.token.addOrChunk(andChunk);
  }

  public addAndChunk(): void {
    this.token.addAndChunk();
  }

  public deleteChunk(chunk: ChunkToken, andToken: AndChunkToken): void {
    this.token.remove(chunk, andToken);
    if (andToken.orChunkList.length === 0) {
      this.token.andChunkList = [];
    }
  }

  public deleteToken(): void {
    this.delete.emit(this.token);
  }

}
