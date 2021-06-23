import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';
import { QueryTag } from '../model/query-token';

@Component({
  selector: 'app-query-tag',
  templateUrl: './query-tag.component.html',
  styleUrls: ['./query-tag.component.scss']
})
export class QueryTagComponent implements OnInit {

  @Input() tag: QueryTag;
  @Input() typeList: KeyValueItem[];
  @Input() metadata: boolean;

  @Output() delete: EventEmitter<QueryTag> = new EventEmitter<QueryTag>();

  public actionList: KeyValueItem[] = [
    new KeyValueItem('IS', 'IS'),
    new KeyValueItem('IS_NOT', 'IS_NOT'),
    new KeyValueItem('BEGINS', 'BEGINS'),
    new KeyValueItem('CONTAINS', 'CONTAINS'),
    new KeyValueItem('ENDS', 'ENDS'),
    new KeyValueItem('REGEXP', 'REGEXP'),
    new KeyValueItem('NOT_REG', 'NOT_REG')];

  public action: KeyValueItem;
  public tagName: KeyValueItem;

  constructor() { }

  ngOnInit(): void {
  }

  public deleteTag(tag: QueryTag): void {
    this.delete.emit(tag);
  }

  public openTypeDialog(): void {
    // this.delete.emit(tag);
  }

  public setTagName(event): void {
    this.tag.name = event.value.key;
  }

  public setTagAttr(event): void {
    switch (event.value.key) {
      case 'IS':
        this.tag.negation = false;
        break;
      case 'IS_NOT':
        this.tag.negation = true;
        break;
      case 'BEGINS':
        this.tag.startsWithValue = true;
        break;
      case 'CONTAINS':
        this.tag.containsValue = true;
        break;
      case 'ENDS':
        this.tag.endsWithValue = true;
        break;
      case 'REGEXP':
        this.tag.matchCase = true;
        break;
      case 'NOT_REG':
        this.tag.matchCase = false;
        break;
    }
  }

}
