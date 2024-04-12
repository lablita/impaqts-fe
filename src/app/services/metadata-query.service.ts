import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Metadatum } from '../model/metadatum';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';

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
    this.metadata = [];
    localStorage.removeItem('metadata');
  }

  public resetMetadataService(): void {
    this.metadata = [];
    const metadataStr = localStorage.getItem('metadata');
    if (metadataStr && metadataStr.length > 0) {
      this.setMetadata(JSON.parse(metadataStr));
    }
  }

  public setMetadata(mds: Array<Metadatum>): void {
    this.metadata = mds;
    this.metadata.sort((a, b) => a.position - b.position);
  }

  private resetMetadatum(metadatum: Metadatum): void {
    metadatum.selected = false;
    metadatum.selection = '';
    if (!!metadatum.subMetadata && metadatum.subMetadata.length > 0) {
      metadatum.subMetadata.forEach(m => this.resetMetadatum(m));
    }
  }

  public isCompiled(): boolean {
    const metadata = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)
    return !!metadata;
  }

}
