import { taggedTemplate } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { STRUCT_DOC, TOKEN } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';

@Component({
  selector: 'app-query-token',
  templateUrl: './query-token.component.html',
  styleUrls: ['./query-token.component.scss']
})
export class QueryTokenComponent {

  @Input() token: QueryToken | null = null;
  @Input() typeList: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Input() defaultType: KeyValueItem | null = null;
  @Input() actionList: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Input() defaultAction: KeyValueItem | null = null;
  @Input() metaList: KeyValueItem[] = Array.from<KeyValueItem>({ length: 0 });
  @Input() option = false;
  @Input() metadata = false;
  @Input() metadatumTextTypes: Metadatum[] | null = null;
  @Output() delete: EventEmitter<QueryToken> = new EventEmitter<QueryToken>();


  public optionList: KeyValueItem[] = [new KeyValueItem('REPEAT', 'REPEAT'), new KeyValueItem('START', 'START'), new KeyValueItem('END', 'END')];
  public optionSel: KeyValueItem | null = null;
  public optionsSel: Array<string> = [];

  public metaSel: KeyValueItem | null = null;

  public repeat = false;

  public addTag(orTags: Array<QueryTag>): void {
    if (this.token) {
      this.token.addOrTag(orTags, this.metadata ? STRUCT_DOC : TOKEN);
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
    if (this.optionsSel.length > 0 && this.token) {
      this.token.sentenceEnd = this.token.sentenceStart = false;
      this.optionsSel.forEach(op => {
        if (op === 'START' && this.token) {
          this.token.sentenceStart = true;
        } else if (op === 'END' && this.token) {
          this.token.sentenceEnd = true;
        }
      });
    }
  }

  public setMeta(): void {
    return;
  }

  public countTags(): number {
    let res = 0;
    this.token?.tags.forEach(tag => res += tag.length);
    return res;
  }

}
