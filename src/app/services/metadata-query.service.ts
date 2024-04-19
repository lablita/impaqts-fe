import { Injectable } from '@angular/core';
import { Metadatum } from '../model/metadatum';
import { CorpusSelectionService } from './corpus-selection.service';
import { TEXT_TYPES_QUERY_REQUEST, VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';

export class Metadata {
  idCorpus: string = '';
  metadata: Metadatum[] = []
}

@Injectable({
  providedIn: 'root'
})
export class MetadataQueryService {

  private metadataRef: Metadata = new Metadata();
  private metadataVQRef: Metadata = new Metadata();
 
  constructor(
    private readonly corpusSelectionService: CorpusSelectionService
  ){}

  private metadataAttributes: Metadatum[] = [];

  public reset(): void {
    this.metadataRef.metadata.forEach(m => this.resetMetadatum(m));
    this.metadataVQRef.metadata.forEach(m => this.resetMetadatum(m));
  }

  public getMetadata(): Array<Metadatum> {
    return this.metadataRef.metadata;
  }

  public getMetadataVQ(): Array<Metadatum> {
    return this.metadataVQRef.metadata;
  }

  public clearMetadata(): void {
    this.metadataRef = new Metadata();
    this.metadataVQRef = new Metadata();
    localStorage.removeItem('metadata');
    localStorage.removeItem('metadataVQ');
  }

  public resetMetadataService(): void {
    let metadataStr = localStorage.getItem('metadata');
    if (metadataStr && metadataStr.length > 0) {
      this.setMetadata(JSON.parse(metadataStr).metadata);
    }
    metadataStr = localStorage.getItem('metadataVQ');
    if (metadataStr && metadataStr.length > 0) {
      this.setMetadataVQ(JSON.parse(metadataStr).metadataVQ);
    }
  }

  public storageMetadataVQ(): void {
    localStorage.setItem('metadataVQ', JSON.stringify(this.metadataVQRef));
  }

  public storageMetadata(): void {
    localStorage.setItem('metadata', JSON.stringify(this.metadataRef));
  }

  public setMetadata(mds: Array<Metadatum>): void {
    if (mds) {
      const metadataRef = new Metadata();
      metadataRef.idCorpus = this.corpusSelectionService.getSelectedCorpus()?.key!;
      metadataRef.metadata = mds.sort((a, b) => a.position - b.position);
      this.metadataRef = metadataRef;
    }
  }

  public setMetadataVQ(mds: Array<Metadatum>): void {
    if (mds) {
      const metadataVQRef = new Metadata();
      metadataVQRef.idCorpus = this.corpusSelectionService.getSelectedCorpus()?.key!;
      metadataVQRef.metadata = mds.sort((a, b) => a.position - b.position);
      this.metadataVQRef = metadataVQRef;
    }
  }
  
  public isCompiled(): boolean {
    const metadata = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)
    return !!metadata;
  }

  public getMetadataIdCorpus(): string {
    return this.metadataRef.idCorpus;
  }

  public getMetadataVQIdCorpus(): string {
    return this.metadataVQRef.idCorpus;
  }

  private resetMetadatum(metadatum: Metadatum): void {
    metadatum.selected = false;
    metadatum.selection = '';
    if (!!metadatum.subMetadata && metadatum.subMetadata.length > 0) {
      metadatum.subMetadata.forEach(m => this.resetMetadatum(m));
    }
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
