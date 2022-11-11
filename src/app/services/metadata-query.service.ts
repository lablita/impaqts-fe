import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Metadatum } from '../model/metadatum';

@Injectable({
  providedIn: 'root'
})
export class MetadataQueryService {

  private metadata: Metadatum[] = [];

  public reset(): void {
    this.metadata.forEach(m => this.resetMetadatum(m));
  }

  public getMetadata(): Array<Metadatum> {
    return this.metadata;
  }

  public clearMetadata(): void {
    this.metadata.splice(0, this.metadata.length);
  }

  public setMetadata(mds: Array<Metadatum>): void {
    this.metadata = mds;
    this.metadata.sort((a, b) => a.position - b.position);
    this.metadata.forEach(md => this.assignSelectionLabel(md));
  }

  private assignSelectionLabel(md: Metadatum): void {
    if (md.multipleChoice) {
      const selection = md.selection as TreeNode<any>[];
      console.log(selection);
      console.log(md.tree);
      if (md.tree && md.tree[0] && md.tree[0].children) {
        if (selection.length === md.tree[0].children.length) {
          // se sono selezionate tutte le foglie, setta come selezionata anche la radice
          selection.push(md.tree[0]);
        } else if (selection.length > 0 && selection.findIndex(s => s.label === md.tree[0].label) < 0) {
          // se sono selezionate alcune foglie ma non tutte, setta come parzialmente selezionata la radice
          // controllo anche di non aver già messo la radice tra le selezionate in una chiamata precedente
          md.tree[0].partialSelected = true;
        }
      }
    }
  }

  private resetMetadatum(metadatum: Metadatum): void {
    metadatum.selected = false;
    metadatum.selection = '';
    if (!!metadatum.subMetadata && metadatum.subMetadata.length > 0) {
      metadatum.subMetadata.forEach(m => this.resetMetadatum(m));
    }
  }

  public isCompiled(): boolean {
    let res = false;
    this.metadata.forEach(m => {
      if (this.compiledMetadatum(m)) {
        res = true;
      }
    });
    return res;
  }

  private compiledMetadatum(metadatum: Metadatum): boolean {
    if ((!!metadatum.selected && metadatum.selected) || this.selectionCompiled(metadatum.selection)) {
      return true;
    } else if (!!metadatum.subMetadata && metadatum.subMetadata.length > 0) {
      metadatum.subMetadata.forEach(m => this.compiledMetadatum(m));
      return false;
    } else {
      return false;
    }
  }

  private selectionCompiled(selection: string | TreeNode | TreeNode[]): boolean {
    if (!!selection) {
      if (selection instanceof String) {
        return selection !== '';
      } else if (selection instanceof Array) {
        return selection.length > 0;
      }
      return true;
    }
    return false;
  }

}
