import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { from, Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { ConcordanceService } from '../concordance/concordance.service';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';

@Injectable({
  providedIn: 'root'
})

export class MetadataUtilService {

  public res: KeyValueItem[] = [];
  public loading = 0;
  private textTypesRequest: TextTypesRequest;

  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  // public createMatadataTree(corpus: string, metadata: Metadatum[]): Observable<Metadatum[]> {

  //   return of(metadata);
  // }

  public createMatadataTree(corpus: string, metadata: Metadatum[]): Observable<any> {

    this.loading = metadata.length;

    // recuro i dati salvati nel localstorage
    this.textTypesRequest = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)) : null;

    // genero albero per componente multiselect check box
    metadata.forEach(md => {
      if ((md.subMetadata?.length >= 0) && !md.freeText) {
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
    this.loading = metadata.length;
    const obsArray = [];
    let i = 0;
    metadata.forEach(metadatum => {
      this.res.push(new KeyValueItem(metadatum.name, ''));
      if (metadatum.retrieveValuesFromCorpus) {
        metadatum.selected = false;
        // setTimeout(() => this.concordanceService.getMetadatumValuesWithMetadatum(corpus, metadatum).subscribe(res =>
        //   this.setInnerTree(res.res, metadata, res.metadatum)), 4000 * index);
        // setTimeout(() => this.concordanceService.getMetadatumValues(corpus, `${STRUCT_DOC}.${metadatum.name}`).subscribe(res =>
        //   this.setInnerTree(res, metadata, metadatum)), 4000 * index);

        // obsArray.push(this.concordanceService.getMetadatumValuesWithMetadatum(corpus, metadatum));

        // obsArray.push(this.concordanceService.getMetadatumValuesWithMetadatum(corpus, metadatum).pipe(delay(4000 * i)));

        obsArray.push(this.concordanceService.getMetadatumValuesWithMetadatum(corpus, metadatum));
        i++;
      } else {
        this.loading--;
      }
    });
    if (obsArray.length > 0) {
      return from(obsArray).pipe(concatMap(item => item.pipe(delay(4000))));

      // from(obsArray).pipe(concatMap(item => item.pipe(delay(4000)))).subscribe(res => {
      //   console.log('metadatum: ');
      //   this.setInnerTree(res['res'], metadata, res['metadatum']);
      // });
    } else {
      return of(metadata);
    }



    // if (this.loading === 0) {
    //   //ordinamento position 
    //   metadata.sort((a, b) => a.position - b.position);
    //   return of(metadata);
    // }
  }

  private setInnerTree(res: any, metadata: Metadatum[], metadatum: Metadatum) {
    //ripristino valori letti da local storage 
    const selectionated = this.textTypesRequest?.singleSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
      this.textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name)[0] :
      (this.textTypesRequest?.multiSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
        this.textTypesRequest.multiSelects.filter(ss => ss.key === metadatum.name)[0] : null);
    this.loading--;

    metadatum = this.mergeMetedata(res, metadatum, selectionated);

    if (this.loading === 0) {
      //collego l'elenco dei metadati recuperato dal corpus e lo collegao al ramo cui spetta
      this.linkLeafs(metadata, this.textTypesRequest);
      // elimino metadata che partecimano ad alberi 
      metadata = metadata.filter(md => !md.child);
      metadata.forEach(md => {
        if (!md.multipleChoice && !md.freeText) {
          this.setUnselectable(md.tree[0]);
        }
      });
    }
  }

  public mergeMetedata(res: any, metadatum: Metadatum, selectionated: Selection): Metadatum {
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
            // icon: selectionated?.value === el ? "pi pi-circle-on" : "pi pi-circle-off",
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

  public setUnselectable(node: TreeNode): void {
    if (node.children?.length > 0) {
      node.selectable = false;
      node.children.forEach(md => {
        this.setUnselectable(md);
      });
    }
  }

}
