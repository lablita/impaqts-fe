import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { QueryTag, QueryToken } from '../model/query-token';

@Component({
  selector: 'app-query-token',
  templateUrl: './query-token.component.html',
  styleUrls: ['./query-token.component.scss']
})
export class QueryTokenComponent implements OnInit {

  @Input() token: QueryToken;
  @Input() typeList: KeyValueItem[];
  @Input() metaList: KeyValueItem[];
  @Input() option: boolean;
  @Input() metadata: boolean;
  @Input() metadatumTextTypes: Metadatum[];
  @Output() delete: EventEmitter<QueryToken> = new EventEmitter<QueryToken>();


  public optionList: KeyValueItem[] = [new KeyValueItem('REPEAT', 'REPEAT'), new KeyValueItem('START', 'START'), new KeyValueItem('END', 'END')];
  public optionSel: KeyValueItem;
  public optionsSel: string[] = [];

  public metaSel: KeyValueItem;

  public repeat = false;

  constructor() { }

  ngOnInit(): void {
    if (this.metadata) {
      this.metaList = this.metadatumTextTypes.map(mt => new KeyValueItem(mt.name, mt.name));
    }
  }

  public addTag(andTag: Array<QueryTag>): void {
    this.token.addTag(andTag);
  }

  public addAndTag(): void {
    this.token.addAndTag();
  }

  public deleteTag(tag: QueryTag, andTag: Array<QueryTag>): void {
    this.token.remove(tag, andTag);
    if (this.token.tags.length === 0) {
      this.delete.emit(this.token);
    }
  }

  public deleteToken(): void {
    this.delete.emit(this.token);
  }

  public setOption(): void {
    if (this.optionsSel.indexOf(this.optionSel.value) >= 0) {
      this.optionsSel.splice(this.optionsSel.indexOf(this.optionSel.value), 1);
    } else if (this.optionSel.key !== 'REPEAT') {
      this.optionsSel.push(this.optionSel.value);
    } else {
      this.repeat = !this.repeat;
    }
  }

  public setMeta(): void {

  }

}
