import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';

export class subMetadatum {
  currentSize: number = 0;
  kwicLines: string[] = new Array<string>();
  inProgress: boolean = false;
  metadataValues: string[] = new Array<string>();
}

@Component({
  selector: 'app-metadata-panel',
  templateUrl: './metadata-panel.component.html',
  styleUrls: ['./metadata-panel.component.scss']
})
export class MetadataPanelComponent {

  @Input() public metadata: Metadatum[] = new Array<Metadatum>();
  @Input() public corpus: string = ''
  @Input() public title: string = ''
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();
  @Output() public setMetadataQuery = new EventEmitter<TextTypesRequest>();

  public res: KeyValueItem[] = [];
  public displayPanelMetadata = false;
  public selected: any;
  public loading = 0;

  private textTypesRequest: TextTypesRequest = new TextTypesRequest();

  // public structPattern: QueryToken[] = [];

  constructor() { }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickMakeConcordance() {
    this.textTypesRequest = new TextTypesRequest();
    this.metadata.forEach(md => {
      if (!!md.selection) {
        if (md.freeText) {
          //freetxt
          this.textTypesRequest.freeTexts.push(new Selection(md.name, md.selection as string));
        } else if (!md.multipleChoice && md.tree && md.tree[0] && md.tree[0].children && md.tree[0].children.length > 0) {
          //single
          this.textTypesRequest.singleSelects.push(new Selection(md.name, (md.selection as TreeNode).label));
        } else {
          //multi
          const values: string[] = [];
          (md.selection as TreeNode[]).forEach(m => {
            if (m.label) {
              values.push(m.label);
            }
          });
          this.textTypesRequest.multiSelects.push(new Selection(md.name, undefined, values));
        }
      }
    });
    localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(this.textTypesRequest));

    this.setMetadataQuery.emit(this.textTypesRequest);
    this.closeSidebarEvent.emit(true);
  }

  public isFilterOptions(): boolean {
    return this.title === 'MENU.FILTER';
  }

  public nodeSelect(event: any) {
  }


}
