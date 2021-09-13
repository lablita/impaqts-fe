import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { QueryTag } from '../model/query-tag';

@Component({
  selector: 'app-query-tag',
  templateUrl: './query-tag.component.html',
  styleUrls: ['./query-tag.component.scss']
})
export class QueryTagComponent implements OnInit {

  @Input() tag: QueryTag;
  @Input() typeList: KeyValueItem[];
  @Input() metadata: boolean;
  @Input() metadatumTextTypes: Metadatum[];

  @Output() delete: EventEmitter<QueryTag> = new EventEmitter<QueryTag>();

  public selectedMetadata = '';
  public freeText = false;
  public freeInputText = '';
  public metadatumSel: Metadatum = null;

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

  public root: Metadatum = new Metadatum();

  constructor() { }

  ngOnInit(): void {
    if (this.metadata) {
      this.root.subMetadata = this.metadatumTextTypes;
      this.metadatumTextTypes.forEach(md => {
        this.root.tree = this.root.tree.concat(md.tree);
      });
    }
  }

  public deleteTag(tag: QueryTag): void {
    this.delete.emit(tag);
  }

  public openTypeDialog(): void {
  }

  public setTagName(event): void {
    this.tag.name = event.value.key;
  }

  public selectedNode(metadata: Metadatum): void {
    if (this.selectedMetadata !== metadata.selection['label'] && metadata.selection['children']?.length <= 0) {
      this.selectedMetadata = metadata.selection['label'];
    } else if (metadata.selection['children']?.length <= 0) {
      this.selectedMetadata = '';
    }

    this.retriveMetadatumFromTreeNode(metadata.selection['label'], this.root);
    if (this.metadatumSel?.freeText) {
      this.freeText = !this.freeText;
    }
    if ((metadata.selection as TreeNode).parent) {
      this.tag.name = (metadata.selection as TreeNode).parent.label.indexOf('doc.') >= 0
        ? (metadata.selection as TreeNode).parent.label.replace('doc.', '') : (metadata.selection as TreeNode).parent.label;
    } else {
      this.tag.name = (metadata.selection as TreeNode).label;
    }
    this.tag.value = this.selectedMetadata;
  }

  private retriveMetadatumFromTreeNode(label: string, metadatum: Metadatum): void {
    if (metadatum.subMetadata?.length > 0) {
      metadatum.subMetadata.forEach(md => this.retriveMetadatumFromTreeNode(label, md));
    }
    if (metadatum.name === label) {
      this.metadatumSel = metadatum;
    }
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
