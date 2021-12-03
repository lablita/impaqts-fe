import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Metadatum } from '../model/Metadatum';

@Injectable({
  providedIn: 'root'
})
export class MetadataQueryService {

  public metadata: Metadatum[] = [];

  constructor() { }

  public reset(): void {
    this.metadata.forEach(m => this.resetMetadatum(m));
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
      metadatum.subMetadata.forEach(m => this.compiledMetadatum(m))
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
