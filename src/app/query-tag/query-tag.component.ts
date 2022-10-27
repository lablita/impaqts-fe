import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { QueryTag } from '../model/query-tag';

@Component({
  selector: 'app-query-tag',
  templateUrl: './query-tag.component.html',
  styleUrls: ['./query-tag.component.scss']
})
export class QueryTagComponent implements OnInit {

  @Input() tag: QueryTag | null = null;
  @Input() typeList: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  @Input() defaultType: KeyValueItem | null = null;
  @Input() actionList: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  @Input() defaultAction: KeyValueItem | null = null;
  @Input() metadata = false;
  @Input() metadatumTextTypes: Array<Metadatum> | null = Array.from<Metadatum>({ length: 0 });
  @Input() deleteTagOn = true;

  @Output() delete: EventEmitter<QueryTag> = new EventEmitter<QueryTag>();

  public selectedMetadata = '';
  public freeText = false;
  public freeInputText = '';
  public metadatumSel: Metadatum | null = null;

  public action: KeyValueItem | null = null;
  public tagName: KeyValueItem | null = null;
  public caseSensitive: string | null = null;

  public caseList: Array<string> = Array.from<string>({ length: 0 });

  public root: Metadatum = new Metadatum();

  ngOnInit(): void {
    this.action = this.defaultAction;
    this.tagName = this.defaultType;
    this.caseList = ['Aa', 'aa'];
    this.caseSensitive = 'Aa';
    if (this.defaultType && this.tag) {
      this.tag.name = this.defaultType.key;
      this.tag.matchCase = true;
    }
    if (this.metadata && this.metadatumTextTypes) {
      this.root.subMetadata = this.metadatumTextTypes;
      this.metadatumTextTypes.forEach(md => {
        this.root.tree = this.root.tree.concat(md.tree);
      });
    }
  }

  public deleteTag(event: MouseEvent): void {
    if (this.tag) {
      this.delete.emit(this.tag);
    }
  }

  public openTypeDialog(): void {
    return;
  }

  public setTagName(event: any): void {
    if (this.tag) {
      this.tag.name = event.value.key;
    }
  }

  public selectedNode(metadata: Metadatum): void {
    if (metadata && metadata.selection) {
      if (this.selectedMetadata !== (metadata.selection as any).label &&
        (!(metadata.selection as any).children || (metadata.selection as any).children.length <= 0)) {
        this.selectedMetadata = (metadata.selection as any).label;
      } else if (!(metadata.selection as any).children || (metadata.selection as any).children.length <= 0) {
        this.selectedMetadata = '';
      }
    }

    this.retriveMetadatumFromTreeNode((metadata.selection as any).label, this.root);
    if (this.metadatumSel && this.metadatumSel.freeText) {
      this.freeText = !this.freeText;
    }
    if (this.tag) {
      if (metadata.selection && (metadata.selection as TreeNode).parent) {
        const parent = (metadata.selection as TreeNode).parent;
        if (parent && parent.label) {
          this.tag.name = parent.label.indexOf('doc.') >= 0
            ? parent.label.replace('doc.', '') : parent.label;
        }
      } else {
        const label = (metadata.selection as TreeNode).label;
        if (label) {
          this.tag.name = label;
        }
      }
      this.tag.value = this.selectedMetadata;
    }
  }

  private retriveMetadatumFromTreeNode(label: string, metadatum: Metadatum): void {
    if (metadatum.subMetadata && metadatum.subMetadata.length > 0) {
      metadatum.subMetadata.forEach(md => this.retriveMetadatumFromTreeNode(label, md));
    }
    if (metadatum.name === label) {
      this.metadatumSel = metadatum;
    }
  }

  public setTagAttr(event: any): void {
    if (this.tag) {
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

  public setMatchCase() {
    if (this.tag) {
      this.tag.matchCase = this.caseSensitive === 'Aa';
    }
  }

}
