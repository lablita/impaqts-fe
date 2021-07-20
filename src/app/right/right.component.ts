import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  public visualQueryOptionsLabel: string;
  public viewOptionsLabel: string;
  public hideMetadataLabel = false;
  public spinnerMetadata = false;

  constructor(
    private readonly translateService: TranslateService,
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.translateService.stream('MENU.VISUAL_QUERY').subscribe(res => this.visualQueryOptionsLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS').subscribe(res => this.viewOptionsLabel = res);
    this.emitterService.clickLabel.subscribe((event: string) => {
      if (event === this.visualQueryOptionsLabel) {
        this.hideMetadataLabel = true;
        this.titleLabel = this.viewOptionsLabel;
      } else {
        this.hideMetadataLabel = false;
        this.titleLabel = event;
      }
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
