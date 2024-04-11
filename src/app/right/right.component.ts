import { KeyValue } from '@angular/common';
import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { KeyValueItem } from '../model/key-value-item';
import { PanelLabelStatus } from '../model/panel-label-status';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';
import { CorpusSelectionService } from '../services/corpus-selection.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {
  public titleLabelKeyValue: KeyValueItem | null = null;
  public faCheck = faCheck;
  public labelVisibleMTD = false;
  public labelVisibleOPT = false;
  public labelDisableMTD = false;
  public labelDisableOPT = false;
  
  public spinnerMetadata = false;

  public verticalLabel = false;
  
  constructor(
    public displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly queryRequestService: QueryRequestService,
    private readonly corpusSelectionService: CorpusSelectionService
  ) { }

  ngOnInit(): void {
    this.displayPanelService.panelLabelStatusSubject.subscribe((panelLabelStatus: PanelLabelStatus) => {
      this.verticalLabel = panelLabelStatus.panelDisplayMTD || panelLabelStatus.panelDisplayOPT;
      this.labelVisibleMTD = panelLabelStatus.labelVisibleMTD;
      this.labelVisibleOPT = panelLabelStatus.labelVisibleOPT;
      this.labelDisableMTD = panelLabelStatus.labelDisableMTD;
      this.labelDisableOPT = panelLabelStatus.labelDisableOPT;
      this.titleLabelKeyValue = panelLabelStatus.titleLabelKeyValue;
    })
    this.emitterService.spinnerMetadata.subscribe({ next: (event: boolean) => {
      this.spinnerMetadata = event; 
    }});
  }

  public labelOPTClick(): void {
    this.displayPanelService.labelOPTClickSubject.next();
  }

  public labelMTDClick(): void {
    this.displayPanelService.labelMTDClickSubject.next();
  }

  public checkMetadata(): boolean {
    return this.metadataQueryService.isCompiled();
  }

  public checkOptions(): boolean {
    return this.queryRequestService.isOptionSet();
  }

  public optionsButtonEnabled(): BehaviorSubject<boolean> {
    return this.displayPanelService.labelOptionsSubject;
  }

  public metadataButtonEnabled(): BehaviorSubject<boolean> {
    return this.displayPanelService.labelMetadataSubject;
  }

}
