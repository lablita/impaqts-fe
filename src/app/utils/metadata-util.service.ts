import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { Selection } from '../model/selection';
import { QueriesContainerService } from '../queries-container/queries-container.service';
import { AppInitializerService } from '../services/app-initializer.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { EmitterService } from './emitter.service';

const FUNCTION = 'function';



@Injectable({
  providedIn: 'root',
})
export class MetadataUtilService {
  public res: KeyValueItem[] = [];
  public isImpaqtsCustom = false;
  //private metadataRequest: MetadataRequest = new MetadataRequest();
  private metadataFromCorpus: { idCorpus: number, results: any[] } = { idCorpus: 0, results: [] };

  constructor(
    private readonly queriesContainerService: QueriesContainerService,
    private readonly appInitializerService: AppInitializerService,
    private readonly emitterService: EmitterService,
    private readonly metadataQueryService: MetadataQueryService
  ) {
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
  }

  public createMatadataTree(
    corpusId: string,
    installation: Installation | undefined,
    visualQueryFlag: boolean
  ): Observable<Metadatum[]> {
    this.res = [];
    if (installation) {
      let metadata = installation.corpora
        .filter((c) => c.id === +corpusId)[0]
        .metadata.filter((md) => md.documentMetadatum);
      this.emitterService.localStorageSubject.next();
      // genero albero per componente multiselect check box
      metadata.forEach((md) => {
        if (visualQueryFlag || (md.subMetadata && !md.freeText)) {
          md.tree = [];
          const res = this.generateTree(md);
          md.tree.push(res.tree);
        }
      });
      // genero albero flat per componente multiselect check box e single select
      const obsArray: Array<any> = [];
      metadata.forEach((metadatum) => {
        this.res.push(new KeyValueItem(metadatum.name, ''));
        if (metadatum.retrieveValuesFromCorpus) {
          metadatum.selected = false;
          obsArray.push(
            this.queriesContainerService.getMetadatumValuesWithMetadatum(
              installation,
              corpusId,
              metadatum
            )
          );
        }
      });
      // elimino metadata che partecipano ad alberi
      metadata = metadata.filter((md) => !md.child);
      const lenObsArray = obsArray.length;
      if (lenObsArray > 0) {
        if (this.metadataFromCorpus.idCorpus !== +corpusId) {
          return forkJoin(obsArray).pipe(
            map((res) => {
              // salvo i risultati delle chiamte di recupero dei metadati dal corpus per utilizzarli nella seconda chiamata 
              this.metadataFromCorpus.idCorpus = +corpusId;
              this.metadataFromCorpus.results = res;
              return this.elaborateMetadatumList(res, metadata, lenObsArray);
            })
          );
        } else {
          return of(this.elaborateMetadatumList(this.metadataFromCorpus.results, metadata, lenObsArray));
        }
      } else {
        this.metadataQueryService.setMetadata4Frequency(JSON.parse(JSON.stringify(metadata)));
        return of(metadata);
      }
    }
    this.metadataQueryService.setMetadata4Frequency([]);
    return of([]);
  }

  public setUnselectable(node: TreeNode): void {
    if (node.children && node.children.length > 0) {
      node.selectable = false;
      node.children.forEach((md) => {
        this.setUnselectable(md);
      });
    }
  }

  private setSelectedFromLocalstorage(
    metadata: Metadatum[],
    selection: Selection,
    type: 'FREE' | 'SINGLE' | 'MULTI'
  ): void {
    if (type === 'FREE') {
      metadata.forEach((md) => {
        if (md.name === selection.key) {
          md.selection = selection.value!;
        }
      });
    } else if (type === 'SINGLE') {
      metadata.forEach((md) => {
        if (md.name === selection.key) {
          const parentNode: TreeNode = {
            key: md.name,
            label: md.label ? md.label : md.name,
            selectable: true,
            children: [],
          };
          const innerNode: TreeNode = {
            key: selection.value,
            label: selection.value,
            parent: parentNode,
            selectable: true,
            children: [],
          };
          md.selection = innerNode;
        }
      });
    } else {
      metadata.forEach((md) => {
        const parentNode: TreeNode = {
          key: md.name,
          label: md.label ? md.label : md.name,
          selectable: true,
          children: [],
        };
        if (md.name === selection.key) {
          const selections: TreeNode[] = [];
          selection.values?.forEach((v) => {
            const treeNode: TreeNode = {
              key: selection.value,
              label: selection.value,
              parent: parentNode,
              selectable: true,
              children: [],
            };
            selections.push(treeNode);
          });
        }
      });
    }
  }

  private setInnerTree(
    res: any,
    metadata: Metadatum[],
    metadatumId: number,
    pruneTree: boolean
  ): Metadatum[] {
    let metadatum: Metadatum | null = null;
    for (const md of metadata) {
      const result = this.retrieveMetadatumFromMetadata(md, metadatumId);
      if (!!result) {
        metadatum = result;
        break;
      }
    }
    if (metadatum) {
      // metadatum = this.mergeMetadata(res, metadatum, null, metadata);
      metadatum = this.mergeMetadata(res, metadatum, metadata);
      if (pruneTree) {
        // collego l'elenco dei metadati recuperato dal corpus e lo collego al ramo cui spetta
        metadata = this.linkLeafs(metadata);
        metadata.forEach((md) => {
          if (!md.multipleChoice && !md.freeText) {
            this.setUnselectable(md.tree[0]);
          }
        });
      }
    }
    return metadata;
  }

  private mergeMetadata(
    res: any,
    metadatum: Metadatum,
    metadata: Metadatum[]
  ): Metadatum {
    const selection: TreeNode[] = [];
    if (res) {
      metadatum.subMetadata = res;
      const root: TreeNode = {
        key: metadatum.name,
        label: metadatum.label ? metadatum.label : metadatum.name,
        selectable: true,
        children: [],
      };
      const rootParent: TreeNode = {
        key: metadatum.name,
        label: metadatum.label ? metadatum.label : metadatum.name,
        selectable: true,
        children: [],
      };
      if (!metadatum.multipleChoice) {
        (res.metadataValues as Array<string>).forEach((el) => {
          const node = {
            label: el,
            key: el,
            selectable: true,
            parent: rootParent,
          };
          if (root.children) {
            root.children.push(node);
          }
        });
      } else {
        (res.metadataValues as Array<string>).forEach((el) => {
          const e = el;
          const node = {
            label: e,
            key: e,
            selectable: true,
            parent: rootParent,
          };
          if (root.children) {
            root.children.push(node);
          }
        });
      }
      metadatum.tree = [];
      if (metadatum.multipleChoice) {
        metadatum.selection = selection;
      }
      metadatum.tree.push(root);
      metadata.forEach((md) => {
        if (metadatum.tree && metadatum.tree[0] && metadatum.tree[0].children) {
          this.setChildrenToTreeNode(
            md.tree,
            metadatum.name,
            metadatum.tree[0].children
          );
        }
      });
    }
    return metadatum;
  }

  private setChildrenToTreeNode(
    tree: TreeNode[],
    key: string,
    children: TreeNode[]
  ): void {
    if (tree && tree.length > 0) {
      for (const node of tree) {
        if (node.key === key) {
          node.children = children;
          return;
        } else if (node.children && node.children.length > 0) {
          this.setChildrenToTreeNode(node.children, key, children);
        }
      }
    }
  }

  // recupero nodo da albero
  private retrieveNodeFromTree(
    tree: TreeNode,
    key: string,
    iteration: number
  ): TreeNode | null {
    if (iteration > 0 && tree.key === key) {
      return tree;
    } else if (tree.children && tree.children.length > 0) {
      let result: TreeNode | null;
      for (const child of tree.children) {
        result = this.retrieveNodeFromTree(child, key, iteration++);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  // recupero metadatum da metadata
  private retrieveMetadatumFromMetadata(
    metadatum: Metadatum,
    metadatumId: number
  ): Metadatum | null {
    if (metadatum.id === metadatumId) {
      return metadatum;
    } else if (metadatum.subMetadata && metadatum.subMetadata.length > 0) {
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

  // collego quanto recuperato dal corpus al nodo corretto
  private linkLeafs(
    metadata: Metadatum[],
  ): Metadatum[] {
    metadata.forEach((md) => {
      if (md.child && md.retrieveValuesFromCorpus) {
        metadata.forEach((m) => {
          if (m.tree && m.tree.length > 0) {
            const node = this.retrieveNodeFromTree(m.tree[0], md.name, 0);
            if (!!node && md && md.tree && md.tree[0] && md.tree[0].children) {
              node.children = md.tree[0].children.slice();
            }
          }
        });
      }
    });
    return metadata;
  }

  private generateTree(meta: Metadatum): { tree: TreeNode } {
    const root = {
      key: meta.name,
      label: meta.label ? meta.label : meta.name,
      selectable: true,
      children: [],
    };
    const rootParent = {
      key: meta.name,
      label: meta.label ? meta.label : meta.name,
      selectable: true,
      children: [],
    };
    const expandBranch = (
      metadata: Metadatum,
      node: TreeNode,
      parentNode: TreeNode
    ) => {
      if (!!metadata.subMetadata && metadata.subMetadata?.length > 0) {
        metadata.subMetadata.forEach((md) => {
          const innerNode: TreeNode = {
            key: md.name,
            label: md.label ? md.label : md.name,
            parent: parentNode,
            selectable: true,
            children: [],
          };
          const innerParentNode: TreeNode = {
            key: md.name,
            label: md.label ? md.label : md.name,
            parent: parentNode,
            selectable: true,
            children: [],
          };
          if (node.children) {
            node.children.push(innerNode);
          }
          if (md.subMetadata.length > 0) {
            expandBranch(md, innerNode, innerParentNode);
          }
        });
      }
    };
    expandBranch(meta, root, rootParent);
    return { tree: root };
  }

  private setHardCodedFunctions(metadata: Metadatum[]): Metadatum[] {
    console.log(metadata);
    const hardcodedFunction = [
      { name: 'TT', label: 'Attacco - TT' },
      { name: 'OP', label: 'Opinione - OP' },
      { name: 'DI', label: 'Difesa - DI' },
      { name: 'EL', label: 'Elogio - EL' },
      { name: 'AU', label: 'Auto-elogio - AU' },
    ];
    const functionMetadatum = metadata.find((m) => m.name === FUNCTION);
    if (functionMetadatum?.subMetadata) {
      (functionMetadatum.subMetadata as any).metadataValues =
        hardcodedFunction.map((h) => h.name);
      (functionMetadatum.tree[0].children as any) = hardcodedFunction.map(
        (h) => {
          const treeNode: TreeNode = {
            label: h.label,
            key: h.name,
            selectable: true,
          };
          return treeNode;
        }
      );
    }
    return metadata;
  }

  private functionsMetadataAggregation4ImpaqtsCustom(
    metadata: Metadatum[]
  ): Metadatum[] {
    const functionsMetadata: Metadatum[] = metadata.filter(
      (m) => m.name.indexOf('.function') > 0
    );
    const notFunctionsMetadata: Metadatum[] = metadata.filter(
      (m) => m.name.indexOf('.function') < 0
    );
    if (functionsMetadata.length > 0) {
      let functionMetadata: Metadatum = new Metadatum();
      functionsMetadata.forEach((m, i) => {
        if (i === 0) {
          functionMetadata = m;
          functionMetadata.label = 'Funzione';
          functionMetadata.name = FUNCTION;
          functionMetadata.tree[0].label = 'Funzione';
        } else {
          (functionMetadata.subMetadata as any).metadataValues = (
            (functionMetadata.subMetadata as any).metadataValues as string[]
          ).concat((m.subMetadata as any).metadataValues);
          const children: TreeNode[] | undefined = m.tree[0].children;
          if (children) {
            functionMetadata.tree[0].children =
              functionMetadata.tree[0].children?.concat(children);
          }
        }
      });
      let seen: any = {};
      (functionMetadata.subMetadata as any).metadataValues = (
        (functionsMetadata[0].subMetadata as any).metadataValues as []
      ).filter((m) => (seen.hasOwnProperty(m) ? false : (seen[m] = true)));
      seen = {};
      functionMetadata.tree[0].children =
        functionMetadata.tree[0].children!.filter((m) =>
          seen.hasOwnProperty(m.label) ? false : (seen[m.label!] = true)
        );
      //sorting
      functionMetadata.tree[0].children.sort((a, b) =>
        a.label!.localeCompare(b.label!)
      );
      (functionMetadata.subMetadata as any).metadataValues.sort();
      notFunctionsMetadata.push(functionsMetadata[0]);
    }
    return notFunctionsMetadata;
  }

  private elaborateMetadatumList(res: any[], metadata: Metadatum[], lenObsArray: number): Metadatum[] {
    res.forEach((item: any, index: number) => {
      metadata = this.setInnerTree(
        item.res,
        metadata,
        item.metadatum.id,
        lenObsArray === index + 1
      );
    });
    metadata.forEach((md) => {
      if (Array.isArray(md.selection)) {
        const selection = md.selection as TreeNode[];
        if (
          selection.length > 0 &&
          md.tree &&
          md.tree[0] &&
          md.tree[0].children &&
          md.tree[0].children?.length > selection.length
        ) {
          md.tree[0].partialSelected = true;
        } else if (
          md.tree &&
          md.tree[0] &&
          md.tree[0].children &&
          md.tree[0].children.length > 0 &&
          md.tree[0].children.length === selection.length
        ) {
          md.selection.push(md.tree[0]);
        }
      }
    });
    this.metadataQueryService.setMetadata4Frequency(JSON.parse(JSON.stringify(metadata)));
    if (this.isImpaqtsCustom) {
      metadata =
        this.functionsMetadataAggregation4ImpaqtsCustom(metadata);
      metadata = this.setHardCodedFunctions(metadata);
    }
    return metadata;
  }
}
