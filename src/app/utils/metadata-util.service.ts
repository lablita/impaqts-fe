import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ConcordanceService } from '../concordance/concordance.service';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';

const TEXT_TYPES_QUERY_REQUEST = 'textTypesQueryRequest';

@Injectable({
  providedIn: 'root'
})

export class MetadataUtilService {



  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }



  public mergeMetedata(res: any, metadatum: Metadatum, selectionated: Selection): Metadatum {
    const selection: TreeNode[] = [];
    if (res) {
      metadatum.subMetadata = res;
      const root: TreeNode = {
        label: metadatum.name,
        selectable: false,
        children: []
      };
      const rootParent: TreeNode = {
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
            parent: rootParent,
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
    }
    return metadatum;
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

  //collego quanto recuperato dal corpus al nodo corretto
  public linkLeafs(metadata: Metadatum[], textTypesRequest: TextTypesRequest): void {
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
  }

  public generateTree(meta: Metadatum, values: string[]): { tree: TreeNode, selections: TreeNode[] } {
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

  public setOnOffRadio(node: TreeNode, label: string): void {
    if (node.children?.length > 0) {
      node.children.forEach(md => {
        this.setOnOffRadio(md, label);
      });
    } else {
      if (!node.icon || node.icon === '') {
        node.icon = node.label === label ? 'pi pi-circle-on' : '';
      } else {
        node.icon = '';
      }
    }
  }

}
