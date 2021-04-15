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
  @Input() option: boolean;

  @Output() delete: EventEmitter<QueryToken> = new EventEmitter<QueryToken>();

  public optionList: KeyValueItem[] = [new KeyValueItem('REPEAT', 'REPEAT'), new KeyValueItem('START', 'START'), new KeyValueItem('END', 'END')];
  public optionSel: KeyValueItem;
  public optionsSel: string[] = [];

  public repeat = false;

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
    if (this.token.andChunkList.length === 0) {
      this.delete.emit(this.token);
    }
  }

  public deleteToken(): void {
    this.delete.emit(this.token);
  }

  public setOption(): void {
    // document.getElementById('chips').click();
    if (this.optionsSel.indexOf(this.optionSel.value) >= 0) {
      this.optionsSel.splice(this.optionsSel.indexOf(this.optionSel.value), 1);
    } else if (this.optionSel.key !== 'REPEAT') {
      this.optionsSel.push(this.optionSel.value);
    } else {
      this.repeat = !this.repeat;
    }
  }

  // public onChange(event): boolean {
  //   if (!(event.keyCode === 8 || event.keyCode === 46)) {
  //     return false;
  //   }
  // }

}
