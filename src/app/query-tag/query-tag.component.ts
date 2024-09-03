import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { KeyValueItem, KeyValueItemExtended } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { QueryTag } from '../model/query-tag';

const IMPL = 'Implicatur';
const TOP = 'Topic';
const PPP = 'Presupposizione';
const VAG = 'Vaghezza';

@Component({
  selector: 'app-query-tag',
  templateUrl: './query-tag.component.html',
  styleUrls: ['./query-tag.component.scss']
})

export class QueryTagComponent implements OnInit {

  @Input() tag: QueryTag | null = null;
  @Input() typeList: Array<KeyValueItem> = [];
  @Input() defaultType: KeyValueItem | null = null;
  @Input() actionList: Array<KeyValueItemExtended> = [];
  @Input() defaultAction: KeyValueItemExtended | null = null;
  @Input() metadata = false;
  @Input() metadatumTextTypes: Array<Metadatum> | null = [];
  @Input() deleteTagOn = true;

  @Output() delete: EventEmitter<QueryTag> = new EventEmitter<QueryTag>();

  public selectedMetadata = '';
  public selectedMetadataLbl = '';
  public freeText = false;
  public freeInputText = '';
  public metadatumSel: Metadatum | null = null;

  public action: KeyValueItemExtended | null = null;
  public tagName: KeyValueItem | null = null;
  public caseSensitive: string | null = null;

  public caseList: Array<string> = [];

  public root: Metadatum = new Metadatum();

  ngOnInit(): void {
    this.action = this.defaultAction;
    this.tagName = this.defaultType;
    this.caseList = ['Aa', 'aa'];
    this.caseSensitive = 'Aa';
    this.actionList = this.actionList
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
      if (this.selectedMetadata !== (metadata.selection as any).key &&
        (!(metadata.selection as any).children || (metadata.selection as any).children.length <= 0)) {
        this.selectedMetadata = (metadata.selection as any).key;
        this.selectedMetadataLbl = (metadata.selection as any).label ? (metadata.selection as any).label : (metadata.selection as any).key;
      } else if (!(metadata.selection as any).children || (metadata.selection as any).children.length <= 0) {
        this.selectedMetadata = '';
        this.selectedMetadataLbl = '';
      }
    }

    this.metadatumSel = new Metadatum();
    this.retriveMetadatumFromTreeNode((metadata.selection as any).label, this.root);
    this.freeText = this.metadatumSel.freeText;
    if (this.tag) {
      if (metadata.selection && (metadata.selection as TreeNode).parent) {
        const parent = (metadata.selection as TreeNode).parent;
        if (parent && parent.key) {
          const structTagToken = parent.key.split('.');
          this.tag.name = structTagToken[structTagToken.length - 1];
          if (structTagToken.length > 1) {
            this.tag.structure = structTagToken[0];
          }
        }
      } else {
        const name = (metadata.selection as TreeNode).key;
        if (name) {
          const structTagToken = name.split('.');
          this.tag.name = structTagToken[structTagToken.length - 1];
          if (structTagToken.length > 1) {
            this.tag.structure = structTagToken[0];
          }
        }
      }
      this.tag.value = !this.freeText ? this.selectedMetadata : '';
      this.tag.label = !this.freeText ? this.selectedMetadataLbl : '';
    }
  }

  private retriveMetadatumFromTreeNode(label: string, metadatum: Metadatum): void {
    if (metadatum.subMetadata && metadatum.subMetadata.length > 0) {
      metadatum.subMetadata.forEach(md => this.retriveMetadatumFromTreeNode(label, md));
    }
    if ((metadatum.label ? metadatum.label : metadatum.name) === label) {
      this.metadatumSel = metadatum;
    }
  }

  public setTagAttr(event: any): void {
    this.tag?.resetTag();
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
          this.tag.regexp = true;
          break;
        case 'NOT_REG':
          this.tag.noregexp = false;
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
