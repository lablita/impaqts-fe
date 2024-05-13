import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { MetadataQueryService } from '../services/metadata-query.service';
import { AppInitializerService } from '../services/app-initializer.service';
import { MetadatumGroup } from '../model/metadatum-group';

export class SubMetadatum {
  currentSize = 0;
  kwicLines: Array<string> = [];
  inProgress = false;
  metadataValues: Array<string> = [];
}

export class MetadataGrouped {
  metadata: Metadatum[] = [];
  metadatumGroup: MetadatumGroup = new MetadatumGroup;
  constructor(metadata: Metadatum[], metadatumGroup: MetadatumGroup) {
    this.metadata = metadata;
    this.metadatumGroup = metadatumGroup;
  }
}

@Component({
  selector: 'app-metadata-panel',
  templateUrl: './metadata-panel.component.html',
  styleUrls: ['./metadata-panel.component.scss']
})
export class MetadataPanelComponent implements OnInit {

  @Input() public corpus: string | null | undefined = '';
  @Input() public title = '';
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public res: KeyValueItem[] = [];
  public displayPanelMetadata = false;
  public selected: any;
  public loading = 0;
  public isImpaqtsCustom = false;
  public metadataGroupedList: MetadataGrouped[] = []
  public metadata: Metadatum[] = [];
  
  constructor(
    private readonly metadataQueryService: MetadataQueryService,
    private readonly appInitializerService: AppInitializerService
  ) { 
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
  }

  ngOnInit(): void {
    this.metadata = this.metadataQueryService.getMetadata();
    this.metadataGroupedList = this.getMetadataGroupedList();
    console.log('Metadata Panel Start');
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public resetMetadata(): void {
    localStorage.removeItem(TEXT_TYPES_QUERY_REQUEST);
    this.metadataQueryService.reset();
  }

  public isFilterOptions(): boolean {
    return this.title === 'MENU.FILTER';
  }

  public nodeSelect(event: any): void {
    return;
  }

  private getMetadataGroupedList(): Array<MetadataGrouped> {
      const result: MetadataGrouped[] = [];
      const metadataGroupUniqueList: MetadatumGroup[] = [];
      const metadataGroupList: MetadatumGroup[] = this.metadata.filter(m => m.metadatumGroup !== null).map(m => m.metadatumGroup!);
      metadataGroupList.forEach(m => {
        if (metadataGroupUniqueList.length === 0) {
          metadataGroupUniqueList.push(m);
        } else if (m && !metadataGroupUniqueList.find(mg => mg.id === m.id)) {
          metadataGroupUniqueList.push(m);
        }
      });
     metadataGroupUniqueList.forEach(mg => {
        const metadataGrouped = new MetadataGrouped(this.metadata.filter(m => m.metadatumGroup?.id === mg?.id!), mg!);
        result.push(metadataGrouped);
      })
      result.sort((a, b) => a.metadatumGroup.position - b.metadatumGroup.position);
      return result;
  }
}
