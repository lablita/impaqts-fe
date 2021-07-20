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
  private textTypesRequest: TextTypesRequest;

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  public createMatadataTree(corpus: string, installation: Installation, visualQueryFlag: boolean): Observable<any> {
    let metadata = installation.corpora.filter(c => c.name === corpus)[0].
      metadata.filter(md => md.documentMetadatum);
    // recuro i dati salvati nel localstorage
    this.textTypesRequest = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)) : null;
    // genero albero per componente multiselect check box
    metadata.forEach(md => {
      if (visualQueryFlag || (md.subMetadata?.length >= 0) && !md.freeText) {
        md.tree = [];
        const res = this.generateTree(md, (this.textTypesRequest?.multiSelects &&
          this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name).length > 0)
          ? this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name)[0].values : null);
        md.tree.push(res['tree']);
        md.selection = res['selections'];
      }
    });
    /** recupero freeText da localstorage */
    if (this.textTypesRequest?.freeTexts) {
      metadata.forEach(md => {
        if (md?.freeText) {
          md.selection = this.textTypesRequest.freeTexts.filter(freeT => freeT.key === md.name)[0]?.value;
        }
      });
    }
    // genero albero flat per componente multiselect check box e single select
    const obsArray = [];
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
        metadata = this.setInnerTree(res['res'], metadata, res['metadatum']['id'], lenObsArray === (index + 1));
        return { md: metadata, ended: lenObsArray === (index + 1) };
      }));
    } else {
      return of({ md: metadata, ended: true });
    }
  }

  private setInnerTree(res: any, metadata: Metadatum[], metadatumId: number, pruneTree: boolean): Metadatum[] {
    let metadatum = null;
    for (const md of metadata) {
      const result = this.retrieveMetadatumFromMetadata(md, metadatumId);
      if (!!result) {
        metadatum = result;
        break;
      }
    }
    const selectionated = this.textTypesRequest?.singleSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
      this.textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name)[0] :
      (this.textTypesRequest?.multiSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
        this.textTypesRequest.multiSelects.filter(ss => ss.key === metadatum.name)[0] : null);

    metadatum = this.mergeMetadata(res, metadatum, selectionated, metadata);
    if (pruneTree) {
      //collego l'elenco dei metadati recuperato dal corpus e lo collegao al ramo cui spetta
      metadata = this.linkLeafs(metadata, this.textTypesRequest);
      metadata.forEach(md => {
        if (!md.multipleChoice && !md.freeText) {
          this.setUnselectable(md.tree[0]);
        }
      });
    }
    return metadata;
  }

  private mergeMetadata(res: any, metadatum: Metadatum, selectionated: Selection, metadata: Metadatum[]): Metadatum {
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
        res.metadataValues.forEach(el => {
          const node = {
            label: el,
            selectable: true,
            parent: rootParent,
          };
          root.children.push(node);
          if (selectionated?.value === el) {
            metadatum.selection = node;
          }
        });
      } else {
        res.metadataValues.forEach(el => {
          const node = {
            label: el,
            selectable: true,
            parent: rootParent
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
      metadata.forEach(md => {
        this.setChildrenToTreeNode(md.tree, metadatum.name, metadatum.tree[0].children);
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
        } else if (node.children?.length > 0) {
          this.setChildrenToTreeNode(node.children, label, children);
        }
      }
    }
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

  // recupero metadatum da metadata
  private retrieveMetadatumFromMetadata(metadatum: Metadatum, metadatumId: number): Metadatum {
    if (metadatum.id === metadatumId) {
      return metadatum;
    } else if (metadatum.subMetadata?.length > 0) {
      let result: Metadatum;
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
            if (!!node) {
              node.children = md.tree[0].children.slice();
              const selected = textTypesRequest?.multiSelects?.filter(ms => ms.key === m.name)[0]?.values;
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
        node.children.push(innerNode);
        if (md.subMetadata.length > 0) {
          expandBranch(md, innerNode, innerParentNode);
        }
      });
    };
    expandBranch(meta, root, rootParent);
    return { tree: root, selections: selections };
  }

  public setUnselectable(node: TreeNode): void {
    if (node.children?.length > 0) {
      node.selectable = false;
      node.children.forEach(md => {
        this.setUnselectable(md);
      });
    }
  }

}
