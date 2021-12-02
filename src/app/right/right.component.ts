import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ALL_LEMMANS, CONCORDANCE, COPYRIGHT, CORPUS_INFO, CREDITS, VISUAL_QUERY } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {
  public faCheck = faCheck;
  public titleLabel = 'PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS';
  public labelOptionsDisabled = true;
  public labelMetadataDisabled = true;
  public hideMetadataLabel = false;
  public hideOptionsLabel = false;
  public spinnerMetadata = false;
  private panelMetaOn = false;
  private panelOptionOn = false;

  private routesHidden = [CORPUS_INFO, ALL_LEMMANS, CREDITS, COPYRIGHT, CONCORDANCE]

  constructor(
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.clickLabel.subscribe((event: KeyValueItem) => {
      if (this.routesHidden.indexOf(event.key) >= 0) {
        this.hideMetadataLabel = true;
        this.hideOptionsLabel = true;
      } else if (this.emitterService.pageMenu === VISUAL_QUERY) {
        this.hideMetadataLabel = true;
        this.hideOptionsLabel = false;
      } else {
        this.hideMetadataLabel = false;
        this.hideOptionsLabel = false;
      }
      if (event.value) {
        this.titleLabel = event.key;
      }
    });
    this.emitterService.clickLabelOptionsDisabled.subscribe((event: boolean) => this.labelOptionsDisabled = event);
    this.emitterService.clickLabelMetadataDisabled.subscribe((event: boolean) => this.labelMetadataDisabled = event);
    this.emitterService.spinnerMetadata.subscribe((event: boolean) => this.spinnerMetadata = event);
  }

  public openSidebarOptions(): void {
    this.panelOptionOn = !this.panelOptionOn;
    this.labelMetadataDisabled = this.panelOptionOn;
    this.emitterService.clickPanelDisplayOptions.emit(this.panelOptionOn);
  }

  public openSidebarMetadata(): void {
    this.panelMetaOn = !this.panelMetaOn;
    this.labelOptionsDisabled = this.panelMetaOn;
    this.emitterService.clickPanelDisplayMetadata.emit(this.panelMetaOn);
  }

}
