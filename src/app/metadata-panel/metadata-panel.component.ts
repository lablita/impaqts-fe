import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ConcordanceService } from '../concordance/concordance.service';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';

const TEXT_TYPES_QUERY_REQUEST = 'textTypesQueryRequest';
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
  @Input() public title: string;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public simple: string;
  public res: KeyValueItem[] = [];
  public displayPanelMetadata = false;
  public selected: any;
  public loading = 0;

  private textTypesRequest: TextTypesRequest;

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  ngOnInit(): void {

    // recuro i dati savati nel localstorage
    this.textTypesRequest = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)) : null;

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
        metadatum.selected = false;
        this.loading++;

        setTimeout(() => this.concordanceService.getMetadatumValues(this.corpus, metadatum.name).subscribe(res => {

          //ripristino valori letti da local storage
          const key = this.textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
            this.textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name)[0]?.values : null as string[];



          this.loading--;


          if (res) {
            metadatum.subMetadata = res;
            const root: TreeNode = {
              label: metadatum.name,
              selectable: false,
              children: []
            };
            if (!metadatum.multipleChoice) {
              res.metadataValues.forEach(el => {
                root.children.push({
                  label: el,
                  selectable: true,
                  icon: key.filter(k => k === el).length > 0 ? "pi pi-circle-on" : "pi pi-circle-off",
                  parent: root,
                });
              });
            }
            else {
              res.metadataValues.forEach(el => {
                root.children.push({
                  label: el,
                  selectable: true,
                  parent: root
                });
              });
            }
            metadatum.tree = [];
            metadatum.tree.push(root);
          }

        }), 4000 * index);
      }
    });


    this.metadata.forEach(md => {
      if (md.freeText) {
        md.selection === this.textTypesRequest.freeTexts.filter(freeT => freeT.key === md.name)[0].value
      }
    });

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
      if (!!md.selection) {
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
      }
    });
    localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(this.textTypesRequest));
    console.log('ok');
  }

  public isFilterOptions(): boolean {
    return this.title === 'MENU.FILTER';
  }

  public selectedNode(metadata: Metadatum): void {
    metadata['tree'][0].children.forEach(el => {
      el.icon = el.label === metadata.selection['label'] ? "pi pi-circle-on" : "pi pi-circle-off";
    });
    metadata.selection['icon'] = "pi pi-circle-on";
  }


}
