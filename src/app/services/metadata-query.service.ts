import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Metadatum } from '../model/metadatum';
import { TEXT_TYPES_QUERY_REQUEST, VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import { KeyValue } from '@angular/common';
import { KeyValueItem } from '../model/key-value-item';

@Injectable({
  providedIn: 'root'
})
export class MetadataQueryService {

  private metadata: Metadatum[] = [];

  private metadataAttributes: Metadatum[] = [];

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

  public setMetadataAttribute(metadataAttribute: Metadatum[]): void {
    this.metadataAttributes = metadataAttribute;
  }
 
  public getMetadataAttributes(): Metadatum[] {
    return this.metadataAttributes;
  }

  public getDefaultMetadataAttributes(): KeyValueItem[] {
    const defaultMetadataAttribute = this.metadataAttributes.filter(md => md.defaultAttribute);
    if (defaultMetadataAttribute && defaultMetadataAttribute.length > 0) {
      return defaultMetadataAttribute.map(md => new KeyValueItem(md.name, md.name));
    }
    return [];
  }

  public clearViewOptionAttributesInLocalstorage(): void {
    localStorage.removeItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
  }

}
