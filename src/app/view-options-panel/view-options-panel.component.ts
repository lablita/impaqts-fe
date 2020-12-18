import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import {
  OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC
} from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { QueryRequest } from '../model/query-request';
import { ViewOptionsQueryRequest } from '../model/view-options-query-request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const VIEW_OPTION_QUERY_REQUEST = 'viewOptionQueryRequest';
@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})

export class ViewOptionsPanelComponent implements OnInit {

  @Input() public corpus: string;
  @Input() public showRightButton: boolean;
  @Input() public corpusAttributes: KeyValueItem[];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public attributeChekBox: KeyValueItem[] = [];
  public displayAttr: KeyValueItem[];
  public selectedDisplayAttr: KeyValueItem;
  public asTooltipLabel: string;
  public refsUpLabel: string;
  public sortGoodLabel: string;
  public showGDEXLabel: string;
  public iconForOneLabel: string;
  public allowMultiLabel: string;
  public flashCopingLabel: string;
  public checkSelLinesLabel: string;
  public showLinesNumLabel: string;
  public shortLongRefLabel: string;

  public viewOptionsQueryRequest: ViewOptionsQueryRequest;

  private queryRequest: QueryRequest;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.viewOptionsQueryRequest = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(VIEW_OPTION_QUERY_REQUEST)) : INSTALLATION_LIST[environment.installation].viewOptionsQueryRequest;
    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.corpusAttributes.forEach(attribute =>
        this.attributeChekBox.push(new KeyValueItem(attribute.key, this.translateService.instant(attribute.value))));

      this.displayAttr = [
        new KeyValueItem(OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.FOR_EACH_TOKEN')),
        new KeyValueItem(OPTIONAL_DISPLAY_ATTR_URL_KWIC, this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.KWIC_TOKEN'))
      ];
      this.selectedDisplayAttr = this.displayAttr.filter(da => da.key === this.viewOptionsQueryRequest.displayAttr)[0];

      this.asTooltipLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.TOOLTIPS');
      this.refsUpLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.REF_UP');
      this.sortGoodLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.TOOLTIPS');
      this.showGDEXLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.REF_UP');
      this.iconForOneLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.ICON_FOR');
      this.allowMultiLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.ALLOW_MULT');
      this.flashCopingLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.COPYING_CLIP');
      this.checkSelLinesLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.CHECK_SEL_LINES');
      this.showLinesNumLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.SHOW_LINE');
      this.shortLongRefLabel = this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.SHORT_LONG');
    });


  }

  public clickChangeViewOption(): void {
    console.log('ok');
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST, JSON.stringify(this.viewOptionsQueryRequest));
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

}
