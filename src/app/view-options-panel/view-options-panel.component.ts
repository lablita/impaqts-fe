import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC
} from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { DEFAULT_VIEW_OPTIONS_QUERY_REQUEST, ViewOptionsQueryRequest } from '../model/view-options-query-request';

const VIEW_OPTION_QUERY_REQUEST = 'viewOptionQueryRequest';
@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})

export class ViewOptionsPanelComponent implements OnInit {

  @Input() public corpus: string | null | undefined = null;
  @Input() public showRightButton = false;
  @Input() public corpusAttributes: Array<KeyValueItem> = [];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public attributeChekBox: Array<KeyValueItem> = [];
  public displayAttr: Array<KeyValueItem> = [];
  public selectedDisplayAttr: KeyValueItem | null = null;
  public asTooltipLabel = '';
  public refsUpLabel = '';
  public sortGoodLabel = '';
  public showGDEXLabel = '';
  public iconForOneLabel = '';
  public allowMultiLabel = '';
  public flashCopingLabel = '';
  public checkSelLinesLabel = '';
  public showLinesNumLabel = '';
  public shortLongRefLabel = '';

  public viewOptionsQueryRequest: ViewOptionsQueryRequest = ViewOptionsQueryRequest.getInstance();

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const voqr = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST);
    if (voqr) {
      this.viewOptionsQueryRequest = voqr ?
        JSON.parse(voqr) : DEFAULT_VIEW_OPTIONS_QUERY_REQUEST;
    }
    this.corpusAttributes.forEach((attribute, index) => {
      this.translateService.stream(attribute.value).subscribe({
        next: res => {
          if (index === 0) {
            this.attributeChekBox = [];
          }
          this.attributeChekBox.push(new KeyValueItem(attribute.key, res));
        }
      });
    });

    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.FOR_EACH_TOKEN').subscribe({
      next: res => {
        this.displayAttr = [];
        this.displayAttr.push(new KeyValueItem(OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, res));
      }
    });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.KWIC_TOKEN').subscribe({
      next: res => {
        this.displayAttr.push(new KeyValueItem(OPTIONAL_DISPLAY_ATTR_URL_KWIC, res));
        this.selectedDisplayAttr = this.displayAttr.filter(da => da.key === this.viewOptionsQueryRequest.displayAttr)[0];
      }
    });

    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.TOOLTIPS').subscribe({ next: res => this.asTooltipLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.REF_UP').subscribe({ next: res => this.refsUpLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.TOOLTIPS').subscribe({ next: res => this.sortGoodLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.REF_UP').subscribe({ next: res => this.showGDEXLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.ICON_FOR').subscribe({ next: res => this.iconForOneLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.ALLOW_MULT').subscribe({ next: res => this.allowMultiLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.COPYING_CLIP').subscribe({ next: res => this.flashCopingLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.CHECK_SEL_LINES').subscribe({ next: res => this.checkSelLinesLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.SHOW_LINE').subscribe({ next: res => this.showLinesNumLabel = res });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.SHORT_LONG').subscribe({ next: res => this.shortLongRefLabel = res });
  }

  public clickChangeViewOption(): void {
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST, JSON.stringify(this.viewOptionsQueryRequest));
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickKwic(): void {
    return;
  }

  public clickSentence(): void {
    return;
  }

}
