import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TEXT_TYPES_QUERY_REQUEST } from '../common/constants';
import { FUNCTION, IMPLICIT } from '../common/query-constants';
import { KeyValueItem } from '../model/key-value-item';
import { MetadataRequest } from '../model/metadata-request';
import { Metadatum } from '../model/metadatum';
import { Selection } from '../model/selection';
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
export class MetadataPanelComponent {

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
  }

  private init(): void {
    // recuro i dati salvati nel localstorage
    const ttqr = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST);
    const metadataRequest: MetadataRequest = ttqr ? JSON.parse(ttqr) : null;
    let selections: Selection[] = [];
    if (metadataRequest) {
      selections = metadataRequest.freeTexts.concat(metadataRequest.multiSelects).concat(metadataRequest.singleSelects);
    }
    if (!this.isImpaqtsCustom) {
      this.metadata = this.metadataQueryService.getMetadata();
      this.restoreFilterSelections(selections, this.metadata);
      this.metadataQueryService.setMetadata(this.metadata);
    } else {
      this.metadataGroupedList = this.metadataQueryService.getMetadataGroupedList();
      const implGroup = this.metadataGroupedList.find(mg => mg.metadatumGroup.name === IMPLICIT);
      if (!implGroup?.metadata.find(md => md.name === 'function')) {
        const funcGroup = this.metadataGroupedList.find(mg => mg.metadatumGroup.name === FUNCTION);
        if (funcGroup && funcGroup.metadata.length > 0) {
          if (implGroup) {
            implGroup.metadata = implGroup.metadata.concat(funcGroup.metadata);
          }
        }
      }
      this.metadataGroupedList = this.metadataGroupedList.filter(mg => mg.metadatumGroup.name !== FUNCTION);
      this.metadataGroupedList.forEach(group => {
        this.restoreFilterSelections(selections, group.metadata);
      });
      this.metadataQueryService.setMetadataGroupedList(this.metadataGroupedList);
    }
    console.log('Metadata Panel Start');
  }

  private restoreFilterSelections(selections: Selection[], metadata: Metadatum[]) {
    if (selections && selections.length > 0) {
      selections.forEach(sel => {
        this.restoreSelection(sel, metadata);
      });
    }
  }

  private restoreSelection(selection: Selection, metadata: Metadatum[]) {
    metadata.forEach(met => {
      if (met.name === selection.key) {
        if (met.freeText) {
          met.selection = selection.value!;
        } else if (met.multipleChoice) {
          met.selection = [];
          selection.values?.forEach(value => {
            const sel: TreeNode = {
              key: value,
              label: value,
              partialSelected: true,
              selectable: true
            };
            (met.selection as TreeNode[]).push(sel);
          });
        } else if (!met.multipleChoice) {
          const sel: TreeNode = {
            key: selection.value,
            label: selection.value,
            partialSelected: false,
            selectable: true
          };
          met.selection = sel;
        }
      }
    });
  }

}
