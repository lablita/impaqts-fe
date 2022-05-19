import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { KeyValueItem } from '../model/key-value-item';
import { MetadataQueryService } from '../services/metadata-query.service';

export class SubMetadatum {
  currentSize = 0;
  kwicLines: Array<string> = Array.from<string>({ length: 0 });
  inProgress = false;
  metadataValues: Array<string> = Array.from<string>({ length: 0 });
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

  constructor(
    public metadataQueryService: MetadataQueryService
  ) { }

  ngOnInit(): void {
    console.log('Metadata Panel Start');
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public resetMetadata(): void {
    localStorage.removeItem(TEXT_TYPES_QUERY_REQUEST);
    this.metadataQueryService.reset();
    console.log('reset');
  }

  public isFilterOptions(): boolean {
    return this.title === 'MENU.FILTER';
  }

  public nodeSelect(event: any): void {
    return;
  }
}
