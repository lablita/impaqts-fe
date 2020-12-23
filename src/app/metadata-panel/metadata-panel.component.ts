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
        const res = this.generateTree(md, (this.textTypesRequest?.multiSelects &&
          this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name).length > 0)
          ? this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name)[0].values : null);
        md.tree.push(res['tree']);
        md.selection = res['selections'];
      }
    });

    // genero albero flat per componente multiselect check box e single select
    this.metadata.forEach((metadatum, index) => {
      this.res.push(new KeyValueItem(metadatum.name, ''));
      if (metadatum.retrieveValuesFromCorpus) {
        metadatum.selected = false;
        this.loading++;
        setTimeout(() => this.concordanceService.getMetadatumValues(this.corpus, metadatum.name).subscribe(res => {
          //ripristino valori letti da local storage 
          const selectionated = this.textTypesRequest?.singleSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
            this.textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name)[0] :
            (this.textTypesRequest?.multiSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
              this.textTypesRequest.multiSelects.filter(ss => ss.key === metadatum.name)[0] : null);
          const selection: TreeNode[] = [];
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
                const node = {
                  label: el,
                  selectable: true,
                  icon: selectionated?.value === el ? "pi pi-circle-on" : "pi pi-circle-off",
                  parent: root,
                };
                root.children.push(node);
                if (selectionated?.value === el) {
                  metadatum.selection = node;
                }
              });
            }
            else {
              res.metadataValues.forEach(el => {
                const node = {
                  label: el,
                  selectable: true,
                  parent: root
                };
                root.children.push(node);
                if (selectionated?.values.indexOf(el) > -1) {
                  selection.push(node);
                }
              });
            }
            metadatum.tree = [];
            if (metadatum.multipleChoice) {
              metadatum.selection = selection;
            }
            metadatum.tree.push(root);
          }
          if (this.loading === 0) {
            //collego l'elenco dei metadati recuperato dal corpus e lo collegao al ramo cui spetta
            this.linkLeafs(this.metadata);
            // elimino metadata che partecimano ad alberi 
            this.metadata = this.metadata.filter(md => !md.child);
          }
        }), 4000 * index);
      }
    });

    /** recupero freeText da localstorage */
    if (this.textTypesRequest?.freeTexts) {
      this.metadata.forEach(md => {
        if (md?.freeText) {
          md.selection = this.textTypesRequest.freeTexts.filter(freeT => freeT.key === md.name)[0]?.value;
        }
      });
    }
    //ordinamento position 
    this.metadata.sort((a, b) => a.position - b.position);
  }

  //collego quanto recuperato cal corpus al nodo corretto
  private linkLeafs(metadata: Metadatum[]): void {
    metadata.forEach(md => {
      if (md.child && md.retrieveValuesFromCorpus) {
        this.metadata.forEach(m => {
          if (m.tree?.length > 0) {
            const node = this.retrieveNodeFromTree(m.tree[0], md.name, 0);
            if (!!node) {
              node.children = md.tree[0].children.slice();
              const selected = this.textTypesRequest?.multiSelects?.filter(ms => ms.key === m.name)[0]?.values;
              if (selected) {
                selected.forEach(sel => {
                  const no = md.tree[0].children.filter(m => m.label === sel);
                  if (no?.length > 0) {
                    (m.selection as TreeNode[]).push(no[0]);
                  }
                });
              }
            }
          }
        });
      }
    });
  }

  // recupero nodo da albero
  private retrieveNodeFromTree(tree: TreeNode, label: string, iteration: number): TreeNode {
    if (iteration > 0 && tree.label === label) {
      return tree;
    } else if (tree.children?.length > 0) {
      let result: TreeNode;
      for (const child of tree.children) {
        result = this.retrieveNodeFromTree(child, label, iteration++);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  private generateTree(meta: Metadatum, values: string[]): { tree: TreeNode, selections: TreeNode[] } {
    const selections: TreeNode[] = [];
    const root = {
      label: meta.name,
      selectable: true,
      children: []
    };
    if (values?.indexOf(meta.name) > -1) {
      selections.push(root);
    }
    const expandBranch = (metadata: Metadatum, parentNode: TreeNode) => {
      metadata.subMetadata.forEach(md => {
        const node: TreeNode = {
          label: md.name,
          parent: parentNode,
          selectable: true,
          children: []
        };
        if (values?.indexOf(md.name) > -1) {
          selections.push(node);
        }
        parentNode.children.push(node);
        if (md.subMetadata.length > 0) {
          expandBranch(md, node);
        }
      });
    };
    expandBranch(meta, root);
    return { tree: root, selections: selections };
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
