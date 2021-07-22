import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ALL_LEMMANS, COPYRIGHT, CORPUS_INFO, CREDITS, VIEW_OPTIONS_LABEL, VISUAL_QUERY } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {

  public titleLabel = 'PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS';
  public labelOptionsDisabled = true;
  public labelMetadataDisabled = true;
  public viewOptionsLabel: string;
  public hideMetadataLabel = false;
  public hideOptionsLabel = false;
  public spinnerMetadata = false;

  constructor(
    private readonly translateService: TranslateService,
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.translateService.stream(VIEW_OPTIONS_LABEL).subscribe(res => this.viewOptionsLabel = res);
    this.emitterService.clickLabel.subscribe((event: KeyValueItem) => {
      if (event.key === CORPUS_INFO || event.key === ALL_LEMMANS || event.key === CREDITS || event.key === COPYRIGHT) {
        this.hideMetadataLabel = true;
        this.hideOptionsLabel = true;
      } else if (this.emitterService.pageMenu === VISUAL_QUERY) {
        this.hideMetadataLabel = true;
        this.hideOptionsLabel = false;
      } else {
        this.hideMetadataLabel = false;
        this.hideOptionsLabel = false;
      }
      this.titleLabel = event.value;
    });
    this.emitterService.clickLabelOptionsDisabled.subscribe((event: boolean) => this.labelOptionsDisabled = event);
    this.emitterService.clickLabelMetadataDisabled.subscribe((event: boolean) => this.labelMetadataDisabled = event);
    this.emitterService.spinnerMetadata.subscribe((event: boolean) => this.spinnerMetadata = event);
  }

  public openSidebarOptions(): void {
    this.emitterService.clickPanelDisplayOptions.emit(true);
  }

  public openSidebarMetadata(): void {
    this.emitterService.clickPanelDisplayMetadata.emit(true);
  }

}
