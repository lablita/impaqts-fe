import { Component, OnDestroy, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { KeyValueItem } from '../model/key-value-item';
import { PanelLabelStatus } from '../model/panel-label-status';
import { AppInitializerService } from '../services/app-initializer.service';
import { CorpusSelectionService } from '../services/corpus-selection.service';
import { DisplayPanelService } from '../services/display-panel.service';
import { MetadataQueryService } from '../services/metadata-query.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit, OnDestroy {
  public titleLabelKeyValue: KeyValueItem | null = null;
  public faCheck = faCheck;
  public labelVisibleMTD = false;
  public labelVisibleOPT = false;
  public labelDisableMTD = false;
  public labelDisableOPT = false;
  public spinnerMetadata = false;
  public verticalLabel = false;
  public metadataLabel = 'PAGE.CONCORDANCE.METADATA';
  public checkMetadata = false;
  private localStorageSubscript: Subscription;
  private spinnerMetadataSubscript: Subscription;

  constructor(
    public displayPanelService: DisplayPanelService,
    private readonly emitterService: EmitterService,
    private readonly metadataQueryService: MetadataQueryService,
    private readonly queryRequestService: QueryRequestService,
    private readonly corpusSelectionService: CorpusSelectionService,
    private readonly appInitializerService: AppInitializerService
  ) {
    if (this.appInitializerService.isImpactCustom()) {
      this.metadataLabel = 'PAGE.CONCORDANCE.FILTERS';
    }
    this.checkMetadata = this.metadataQueryService.isCompiled();
    this.localStorageSubscript = this.emitterService.localStorageSubject.subscribe(res =>
      this.checkMetadata = this.metadataQueryService.isCompiled()
    );
    this.spinnerMetadataSubscript = this.emitterService.spinnerMetadata.subscribe({
      next: (event: boolean) => {
        this.spinnerMetadata = event;
      }
    });
  }

  ngOnInit(): void {
    this.displayPanelService.panelLabelStatusSubject.subscribe((panelLabelStatus: PanelLabelStatus) => {
      this.verticalLabel = panelLabelStatus.panelDisplayMTD || panelLabelStatus.panelDisplayOPT;
      this.labelVisibleMTD = panelLabelStatus.labelVisibleMTD;
      this.labelVisibleOPT = panelLabelStatus.labelVisibleOPT;
      this.labelDisableMTD = panelLabelStatus.labelDisableMTD || !this.corpusSelectionService.getSelectedCorpus();
      this.labelDisableOPT = panelLabelStatus.labelDisableOPT;
      this.titleLabelKeyValue = panelLabelStatus.titleLabelKeyValue;
    });
  }

  ngOnDestroy(): void {
    if (this.localStorageSubscript) {
      this.localStorageSubscript.unsubscribe();
    }
    if (this.spinnerMetadataSubscript) {
      this.spinnerMetadataSubscript.unsubscribe();
    }
  }

  public labelOPTClick(): void {
    this.displayPanelService.labelOPTClickSubject.next();
  }

  public labelMTDClick(): void {
    this.displayPanelService.labelMTDClickSubject.next();
  }

  public checkOptions(): boolean {
    return this.queryRequestService.isOptionSet();
  }

  public optionsButtonEnabled(): BehaviorSubject<boolean> {
    return this.displayPanelService.labelOptionsSubject;
  }
}
