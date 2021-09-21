import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { concat, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { ConcordanceService } from '../concordance/concordance.service';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';

@Injectable({
  providedIn: 'root'
})

export class MetadataUtilService {

  public res: KeyValueItem[] = [];
  private textTypesRequest: TextTypesRequest = new TextTypesRequest();

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  public createMatadataTree(corpus: string, installation: Installation, visualQueryFlag: boolean): Observable<any> {
    let metadata = installation.corpora.filter(c => c.name === corpus)[0].
      metadata.filter(md => md.documentMetadatum);
    // recuro i dati salvati nel localstorage
    const ttqr = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST);
    this.textTypesRequest = ttqr ? JSON.parse(ttqr) : null;
    // genero albero per componente multiselect check box
    metadata.forEach(md => {
      if (visualQueryFlag || (md.subMetadata?.length >= 0) && !md.freeText) {
        md.tree = [];
        let filteredSelections: Array<Selection> = new Array<Selection>();
        if (this.textTypesRequest.multiSelects) {
          filteredSelections = this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name);
        }
        if (filteredSelections[0] && filteredSelections[0].values) {
          const res = this.generateTree(md, filteredSelections.length > 0 ? filteredSelections[0].values : []);
          md.tree.push(res['tree']);
          md.selection = res['selections'];
        }
      }
    });
    /** recupero freeText da localstorage */
    if (this.textTypesRequest?.freeTexts) {
      metadata.forEach(md => {
        if (md.freeText) {
          const value = this.textTypesRequest.freeTexts.filter(freeT => freeT.key === md.name)[0].value;
          if (value) {
            md.selection = value;
          }
        }
      });
    }
    // genero albero flat per componente multiselect check box e single select
    const obsArray = new Array<any>();
    metadata.forEach(metadatum => {
      this.res.push(new KeyValueItem(metadatum.name, ''));
      if (metadatum.retrieveValuesFromCorpus) {
        metadatum.selected = false;
        obsArray.push(this.concordanceService.getMetadatumValuesWithMetadatum(corpus, metadatum));
      }
    });
    //elimino metadata che partecimano ad alberi 
    metadata = metadata.filter(md => !md.child);
    const lenObsArray = obsArray.length;
    if (lenObsArray > 0) {
      return concat(...obsArray).pipe(map((res, index) => {
        metadata = this.setInnerTree((res as any).res, metadata, (res as any).metadatum.id, lenObsArray === (index + 1));
        return { md: metadata, ended: lenObsArray === (index + 1) };
      }));
    } else {
      return of({ md: metadata, ended: true });
    }
  }

  private setInnerTree(res: any, metadata: Metadatum[], metadatumId: number, pruneTree: boolean): Metadatum[] {
    let metadatum: Metadatum | null = null;
    for (const md of metadata) {
      const result = this.retrieveMetadatumFromMetadata(md, metadatumId);
      if (!!result) {
        metadatum = result;
        break;
      }
    }
    if (metadatum) {
      const selected = this.textTypesRequest?.singleSelects.filter(ss => metadatum && ss.key === metadatum.name).length > 0 ?
        this.textTypesRequest.singleSelects.filter(ss => metadatum && ss.key === metadatum.name)[0] :
        (this.textTypesRequest?.multiSelects.filter(ss => metadatum && ss.key === metadatum.name).length > 0 ?
          this.textTypesRequest.multiSelects.filter(ss => metadatum && ss.key === metadatum.name)[0] : null);
      if (selected) {
        metadatum = this.mergeMetadata(res, metadatum, selected, metadata);
        if (pruneTree) {
          //collego l'elenco dei metadati recuperato dal corpus e lo collegao al ramo cui spetta
          metadata = this.linkLeafs(metadata, this.textTypesRequest);
          metadata.forEach(md => {
            if (!md.multipleChoice && !md.freeText) {
              this.setUnselectable(md.tree[0]);
            }
          });
        }
      }
    }
    return metadata;
  }

  private mergeMetadata(res: any, metadatum: Metadatum, selected: Selection, metadata: Metadatum[]): Metadatum {
    const selection: TreeNode[] = [];
    if (res) {
      metadatum.subMetadata = res;
      const root: TreeNode = {
        label: metadatum.name,
        selectable: true,
        children: []
      };
      const rootParent: TreeNode = {
        label: metadatum.name,
        selectable: true,
        children: []
      };
      if (!metadatum.multipleChoice) {
        (res.metadataValues as Array<string>).forEach(el => {
          const node = {
            label: el,
            selectable: true,
            parent: rootParent,
          };
          if (root.children) {
            root.children.push(node);
          }
          if (selected && selected.value === el) {
            metadatum.selection = node;
          }
        });
      } else {
        (res.metadataValues as Array<string>).forEach(el => {
          const e = el as string;
          const node = {
            label: e,
            selectable: true,
            parent: rootParent
          };
          if (root.children) {
            root.children.push(node);
          }
          if (selected && selected.values && selected.values.indexOf(el) > -1) {
            selection.push(node);
          }
        });
      }
      metadatum.tree = [];
      if (metadatum.multipleChoice) {
        metadatum.selection = selection;
      }
      metadatum.tree.push(root);
      metadata.forEach(md => {
        if (metadatum.tree && metadatum.tree[0] && metadatum.tree[0].children) {
          this.setChildrenToTreeNode(md.tree, metadatum.name, metadatum.tree[0].children);
        }
      });
    }
    return metadatum;
  }

  private setChildrenToTreeNode(tree: TreeNode[], label: string, children: TreeNode[]): void {
    if (tree?.length > 0) {
      for (const node of tree) {
        if (node.label === label) {
          node.children = children;
          return;
        } else if (node.children && node.children.length > 0) {
          this.setChildrenToTreeNode(node.children, label, children);
        }
      }
    }
  }

  // recupero nodo da albero
  private retrieveNodeFromTree(tree: TreeNode, label: string, iteration: number): TreeNode | null {
    if (iteration > 0 && tree.label === label) {
      return tree;
    } else if (tree.children && tree.children?.length > 0) {
      let result: TreeNode | null;
      for (const child of tree.children) {
        result = this.retrieveNodeFromTree(child, label, iteration++);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  // recupero metadatum da metadata
  private retrieveMetadatumFromMetadata(metadatum: Metadatum, metadatumId: number): Metadatum | null {
    if (metadatum.id === metadatumId) {
      return metadatum;
    } else if (metadatum.subMetadata?.length > 0) {
      let result: Metadatum | null;
      for (const child of metadatum.subMetadata) {
        result = this.retrieveMetadatumFromMetadata(child, metadatumId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  //collego quanto recuperato dal corpus al nodo corretto
  private linkLeafs(metadata: Metadatum[], textTypesRequest: TextTypesRequest): Metadatum[] {
    metadata.forEach(md => {
      if (md.child && md.retrieveValuesFromCorpus) {
        metadata.forEach(m => {
          if (m.tree?.length > 0) {
            const node = this.retrieveNodeFromTree(m.tree[0], md.name, 0);
            if (!!node && md && md.tree && md.tree[0] && md.tree[0].children) {
              node.children = md.tree[0].children.slice();
              const selected = textTypesRequest?.multiSelects?.filter(ms => ms.key === m.name)[0]?.values;
              if (selected) {
                selected.forEach(sel => {
                  if (md.tree[0].children) {
                    const no = md.tree[0].children.filter(m2 => m2.label === sel);
                    if (no?.length > 0) {
                      (m.selection as TreeNode[]).push(no[0]);
                    }
                  }
                });
              }
            }
          }
        });
      }
    });
    return metadata;
  }

  private generateTree(meta: Metadatum, values: string[]): { tree: TreeNode, selections: TreeNode[] } {
    const selections: TreeNode[] = [];
    const root = {
      label: meta.name,
      selectable: true,
      children: []
    };
    const rootParent = {
      label: meta.name,
      selectable: true,
      children: []
    };
    if (values?.indexOf(meta.name) > -1) {
      selections.push(root);
    }
    const expandBranch = (metadata: Metadatum, node: TreeNode, parentNode: TreeNode) => {
      metadata.subMetadata.forEach(md => {
        const innerNode: TreeNode = {
          label: md.name,
          parent: parentNode,
          selectable: true,
          children: []
        };
        const innerParentNode: TreeNode = {
          label: md.name,
          parent: parentNode,
          selectable: true,
          children: []
        };
        if (values?.indexOf(md.name) > -1) {
          selections.push(innerNode);
        }
        if (node.children) {
          node.children.push(innerNode);
        } if (md.subMetadata.length > 0) {
          expandBranch(md, innerNode, innerParentNode);
        }
      });
    };
    expandBranch(meta, root, rootParent);
    return { tree: root, selections: selections };
  }

  public setUnselectable(node: TreeNode): void {
    if (node.children && node.children.length > 0) {
      node.selectable = false;
      node.children.forEach(md => {
        this.setUnselectable(md);
      });
    }
  }

}
