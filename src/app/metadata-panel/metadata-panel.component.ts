import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { AppInitializerService } from '../services/app-initializer.service';
import { MetadataGrouped, MetadataQueryService } from '../services/metadata-query.service';


export class SubMetadatum {
  currentSize = 0;
  kwicLines: Array<string> = [];
  inProgress = false;
  metadataValues: Array<string> = [];
}

@Component({
  selector: 'app-metadata-panel',
  templateUrl: './metadata-panel.component.html',
  styleUrls: ['./metadata-panel.component.scss']
})
export class MetadataPanelComponent implements OnInit, AfterViewInit {

  @Input() public corpus: string | null | undefined = '';
  @Input() public title = '';
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public res: KeyValueItem[] = [];
  public displayPanelMetadata = false;
  public selected: any;
  public loading = 0;
  public isImpaqtsCustom = false;
  public metadataGroupedList: MetadataGrouped[] = [];
  public metadata: Metadatum[] = [];
  public render = false;

  constructor(
    private readonly metadataQueryService: MetadataQueryService,
    private readonly appInitializerService: AppInitializerService
  ) {
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
    this.init();
    setTimeout(() =>
      this.render = true, 100);
  }

  ngAfterViewInit(): void {
    //this.init();
  }

  ngOnInit(): void {
    //this.init();
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public resetMetadata(): void {
    localStorage.removeItem(TEXT_TYPES_QUERY_REQUEST);
    this.metadataQueryService.reset();
    this.init();
  }

  public isFilterOptions(): boolean {
    return this.title === 'MENU.FILTER';
  }

  public nodeSelect(event: any): void {
    if (!this.isImpaqtsCustom) {
      this.metadataQueryService.setMetadata(this.metadata);
    } else {
      this.metadataQueryService.setMetadataGroupedList(this.metadataGroupedList);
    }
    return;
  }

  private init(): void {
    if (!this.isImpaqtsCustom) {
      this.metadata = this.metadataQueryService.getMetadata();
    } else {
      this.metadataGroupedList = this.metadataQueryService.getMetadataGroupedList();
    }
    console.log('Metadata Panel Start');
  }

}
