import { Component, EventEmitter, Input, Output } from '@angular/core';
import { STRUCT_DOC, TOKEN } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';

@Component({
  selector: 'app-query-token',
  templateUrl: './query-token.component.html',
  styleUrls: ['./query-token.component.scss']
})
export class QueryTokenComponent {

  @Input() token: QueryToken | null = null;
  @Input() typeList: KeyValueItem[] | null = null;
  @Input() metaList: KeyValueItem[] | null = null;
  @Input() option = false;
  @Input() metadata = false;
  @Input() metadatumTextTypes: Metadatum[] | null = null;
  @Output() delete: EventEmitter<QueryToken> = new EventEmitter<QueryToken>();


  public optionList: KeyValueItem[] = [new KeyValueItem('REPEAT', 'REPEAT'), new KeyValueItem('START', 'START'), new KeyValueItem('END', 'END')];
  public optionSel: KeyValueItem | null = null;
  public optionsSel: Array<string> = [];

  public metaSel: KeyValueItem | null = null;

  public repeat = false;

  constructor() {
  }

  public addTag(andTag: Array<QueryTag>): void {
    if (this.token) {
      this.token.addTag(andTag, this.metadata ? STRUCT_DOC : TOKEN);
    }
  }

  public addAndTag(): void {
    if (this.token) {
      this.token.addAndTag(this.metadata ? STRUCT_DOC : TOKEN);
    }
  }

  public deleteTag(tag: QueryTag, andTag: Array<QueryTag>): void {
    if (this.token) {
      this.token.remove(tag, andTag);
      if (this.token.tags.length === 0) {
        this.delete.emit(this.token);
      }
    }
  }

  public deleteToken(): void {
    if (this.token) {
      this.delete.emit(this.token);
    }
  }

  public setOption(): void {
    if (this.optionSel) {
      if (this.optionSel.value && this.optionsSel.indexOf(this.optionSel.value) >= 0) {
        this.optionsSel.splice(this.optionsSel.indexOf(this.optionSel.value), 1);
      } else if (this.optionSel.key !== 'REPEAT') {
        this.optionsSel.push(this.optionSel.value);
      } else {
        this.repeat = !this.repeat;
      }
    }
  }

  public setMeta(): void {

  }

}
