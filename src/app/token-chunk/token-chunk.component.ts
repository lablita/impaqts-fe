import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChunkToken } from '../model/chunk-token';
import { KeyValueItem } from '../model/key-value-item';

@Component({
  selector: 'app-token-chunk',
  templateUrl: './token-chunk.component.html',
  styleUrls: ['./token-chunk.component.scss']
})
export class TokenChunkComponent implements OnInit {

  @Input() token: ChunkToken;
  @Input() typeList: KeyValueItem[];
  @Input() actionList: KeyValueItem[];

  @Output() delete: EventEmitter<ChunkToken> = new EventEmitter<ChunkToken>();

  constructor() { }

  ngOnInit(): void {
  }

  public deleteChunk(chunk: ChunkToken): void {
    this.delete.emit(chunk);
  }

}
