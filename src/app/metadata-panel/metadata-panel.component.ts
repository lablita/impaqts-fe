import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ConcordanceService } from '../concordance/concordance.service';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';

export class subMetadatum {
  currentSize: number;
  kwicLines: string[];
  inProgress: boolean;
  metadataValues: string[];
}

@Component({
  selector: 'app-metadata-panel',
  templateUrl: './metadata-panel.component.html',
  styleUrls: ['./metadata-panel.component.scss']
})
export class MetadataPanelComponent implements OnInit {

  @Input() public metadata: Metadatum[];
  @Input() public corpus: string;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public simple: string;
  public res: KeyValueItem[] = [];
  public displayPanelMetadata = false;
  public selected: any;

  private textTypesRequest: TextTypesRequest;

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  ngOnInit(): void {


    // genero albero per componente multiselect check box
    this.metadata.forEach(md => {
      if (md.subMetadata?.length > 0) {
        md.tree = [];
        md.tree.push(this.generateTree(md));
      }
    });
    // elimino metadata che partecimano ad alberi 
    this.metadata = this.metadata.filter(md => !md.child);

    //ordinamento position 
    this.metadata.sort((a, b) => a.position - b.position);

    // genero albero flat per componente multiselect check box e single select
    this.metadata.forEach((metadatum, index) => {
      this.res.push(new KeyValueItem(metadatum.name, ''));
      if (metadatum.retrieveValuesFromCorpus) {
        setTimeout(() => this.concordanceService.getMetadatumValues(this.corpus, metadatum.name).subscribe(res => {
          if (res) {
            metadatum.subMetadata = res;
            const root: TreeNode = {
              label: metadatum.name,
              selectable: false,
              children: []
            };
            res.metadataValues.forEach(el => {
              root.children.push({
                label: el,
                selectable: true,
                parent: root,
              });
            });
            metadatum.tree = [];
            metadatum.tree.push(root);
          }
        }), 4000 * index);
      }
    });
    console.log('test');
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  private generateTree(meta: Metadatum): TreeNode {
    const root = {
      label: meta.name,
      selectable: true,
      children: []
    };
    const expandBranch = (metadata: Metadatum, parentNode: TreeNode) => {
      metadata.subMetadata.forEach(md => {
        const node: TreeNode = {
          label: md.name,
          parent: parentNode,
          selectable: true,
          children: []
        };
        parentNode.children.push(node);
        if (md.subMetadata.length > 0) {
          expandBranch(md, node);
        }
      });
    };
    expandBranch(meta, root);
    return root;
  }

  public clickMakeConcordance() {
    this.textTypesRequest = new TextTypesRequest();
    this.metadata.forEach(md => {
      if (md.freeText) {
        //freetxt
        this.textTypesRequest.freeTexts.push(new Selection(md.name, md.selection as string));
      } else if (!md.multipleChoice && (md?.tree[0]?.children.length > 0)) {
        //single
        this.textTypesRequest.singleSelects.push(new Selection(md.name, (md.selection as TreeNode).label));
      } else {
        //multi
        const values: string[] = [];
        (md.selection as TreeNode[]).forEach(m => {
          values.push(m.label);
        });
        this.textTypesRequest.multiSelects.push(new Selection(md.name, null, values));
      }
    });
  }

}
