import { Component, OnInit } from '@angular/core';
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

  constructor(
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.clickLabel.subscribe((event: string) => {
      this.titleLabel = event;
    });
    this.emitterService.clickLabelOptionsDisabled.subscribe((event: boolean) => {
      this.labelOptionsDisabled = event;
    });
    this.emitterService.clickLabelMetadataDisabled.subscribe((event: boolean) => {
      this.labelMetadataDisabled = event;
    });
  }

  public openSidebarOptions(): void {
    this.emitterService.clickPanelDisplayOptions.emit(true);
  }

  public openSidebarMetadata(): void {
    this.emitterService.clickPanelDisplayMetadata.emit(true);
  }

}
