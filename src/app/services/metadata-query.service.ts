import { Injectable } from '@angular/core';
import { Metadatum } from '../model/metadatum';
import { CorpusSelectionService } from './corpus-selection.service';
import { TEXT_TYPES_QUERY_REQUEST, VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { ErrorMessagesService } from './error-messages.service';
import { Message } from 'primeng/api';
import { MetadatumGroup } from '../model/metadatum-group';

export class Metadata {
  idCorpus: string = '';
  metadata: Metadatum[] = []
}

export class MetadataGrouped {
  metadata: Metadatum[] = [];
  metadatumGroup: MetadatumGroup = new MetadatumGroup;
  constructor(metadata: Metadatum[], metadatumGroup: MetadatumGroup) {
    this.metadata = metadata;
    this.metadatumGroup = metadatumGroup;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetadataQueryService {

  private metadataRef: Metadata = new Metadata();
  private metadataVQRef: Metadata = new Metadata();
  private metadataGroupedList: MetadataGrouped[] = [];
 
  constructor(
    private readonly corpusSelectionService: CorpusSelectionService,
    private readonly errorMessagesService: ErrorMessagesService
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
      this.metadataGroupedList = this.buildMetadataGroupedList(mds);
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
    const metadataStr = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST);
    let result = false;
    if (metadataStr) {
      const metadata = JSON.parse(metadataStr);
      if (metadata.freeTexts && metadata.freeTexts.length > 0) {
        result = result || (metadata.freeTexts as any[]).filter((ft: any) => ft.value.length > 0).length > 0;
      } else if (metadata.singleSelects && metadata.singleSelects.length > 0) {
        result = result || (metadata.singleSelects as any[]).filter((ss: any) => ss.value.length > 0).length > 0;
      } else if (metadata.multiSelects && metadata.multiSelects.length > 0){
        result = result || (metadata.multiSelects as any[]).filter((ss: any) => ss.values.length > 0).length > 0;
      }
      return result;
    }
    return false;
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
    const metadataErrorMsg = {} as Message;
    metadataErrorMsg.severity = 'error';
    metadataErrorMsg.detail = 'Nessun Metadato di tipo Attributo è stato impostato di Default nella configurazione del Corpus, impossibile Proseguire';
    metadataErrorMsg.summary = 'Errore';
    this.errorMessagesService.sendError(metadataErrorMsg);
    return [];
  }

  public clearViewOptionAttributesInLocalstorage(): void {
    localStorage.removeItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
  }

  public getMetadataGroupedList(): Array<MetadataGrouped> {
    return this.metadataGroupedList;
  }

  private buildMetadataGroupedList(metadata: Metadatum[]): Array<MetadataGrouped> {
    const result: MetadataGrouped[] = [];
    const metadataGroupUniqueList: MetadatumGroup[] = [];
    const metadataGroupList: MetadatumGroup[] = metadata.filter(m => m.metadatumGroup !== null).map(m => m.metadatumGroup!);
    metadataGroupList.forEach(m => {
      if (metadataGroupUniqueList.length === 0) {
        metadataGroupUniqueList.push(m);
      } else if (m && !metadataGroupUniqueList.find(mg => mg.id === m.id)) {
        metadataGroupUniqueList.push(m);
      }
    });
    metadataGroupUniqueList.forEach(mg => {
      const metadataGrouped = new MetadataGrouped(metadata.filter(m => m.metadatumGroup?.id === mg?.id!), mg!);
      result.push(metadataGrouped);
    })
    //recupero metadati che non hanno un gruppo associato
    const metadataNoGroup = metadata.filter(m => !m.metadatumGroup);
    if (metadataNoGroup.length > 0) {
      const metadatumGroup = new MetadatumGroup();
      metadatumGroup.name = 'NO_LABEL';
      metadatumGroup.position = 1000;
      const metadataGrouped = new MetadataGrouped(metadataNoGroup, metadatumGroup);
      result.push(metadataGrouped);  
    }
    result.sort((a, b) => a.metadatumGroup.position - b.metadatumGroup.position);
    return result;
}

}
