import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConcordanceService } from '../concordance/concordance.service';
import { DropdownItem } from '../model/dropdown-item';
import { Metadatum } from '../model/Metadatum';

export class subMetadatum {
  currentSize: number;
  kwicLines: string[];
  inProgress: boolean;
  metadataValues: string[];
}

@Component({
  selector: 'app-metadata-panel',
  templateUrl: './metadata-panel.component.html',
  styleUrls: ['./metadata-panel.component.scss']
})
export class MetadataPanelComponent implements OnInit {

  @Input() public metadata: Metadatum[];
  @Input() public corpus: string;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public subcorpusList: DropdownItem[] = [];
  public selectedSubcorpus: DropdownItem;

  public simple: string;

  public res: DropdownItem[] = [];

  public displayPanelMetadata = false;


  constructor(
    private readonly concordanceService: ConcordanceService
  ) { }

  ngOnInit(): void {
    this.metadata.sort((a, b) => a.position - b.position);
    this.metadata.forEach(metadatum => {
      this.res.push(new DropdownItem(metadatum.name, ''));
      if (metadatum.multipleChoice) {
        this.concordanceService.getMetadatumValues(this.corpus, metadatum.name).subscribe(res => {
          const r = res;

        });
      }
    });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }



}
