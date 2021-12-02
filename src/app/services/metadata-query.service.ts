import { Injectable } from '@angular/core';
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
}
