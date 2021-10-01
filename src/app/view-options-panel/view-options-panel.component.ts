import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import {
  OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC
} from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { ViewOptionsQueryRequest } from '../model/view-options-query-request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const VIEW_OPTION_QUERY_REQUEST = 'viewOptionQueryRequest';
@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})

export class ViewOptionsPanelComponent implements OnInit {

  @Input() public corpus: string | null = null;
  @Input() public showRightButton = false;
  @Input() public corpusAttributes: KeyValueItem[] = new Array<KeyValueItem>();
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public attributeChekBox: KeyValueItem[] = [];
  public displayAttr: KeyValueItem[] = new Array<KeyValueItem>();
  public selectedDisplayAttr: KeyValueItem | null = null;
  public asTooltipLabel: string = '';
  public refsUpLabel: string = '';
  public sortGoodLabel: string = '';
  public showGDEXLabel: string = '';
  public iconForOneLabel: string = '';
  public allowMultiLabel: string = '';
  public flashCopingLabel: string = '';
  public checkSelLinesLabel: string = '';
  public showLinesNumLabel: string = '';
  public shortLongRefLabel: string = '';

  public viewOptionsQueryRequest: ViewOptionsQueryRequest = ViewOptionsQueryRequest.getInstance();

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const voqr = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST);
    const inst = INSTALLATION_LIST.find(i => i.index === environment.installation);
    if (voqr) {
      this.viewOptionsQueryRequest = voqr ?
        JSON.parse(voqr) : inst && inst.startup.viewOptionsQueryRequest;
    }
    this.corpusAttributes.forEach((attribute, index) => {
      this.translateService.stream(attribute.value).subscribe(res => {
        if (index === 0) {
          this.attributeChekBox = [];
        }
        this.attributeChekBox.push(new KeyValueItem(attribute.key, res));
      });
    });

    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.FOR_EACH_TOKEN').subscribe(res => {
      this.displayAttr = [];
      this.displayAttr.push(new KeyValueItem(OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, res));
    });
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.KWIC_TOKEN').subscribe(res => {
      this.displayAttr.push(new KeyValueItem(OPTIONAL_DISPLAY_ATTR_URL_KWIC, res));
      this.selectedDisplayAttr = this.displayAttr.filter(da => da.key === this.viewOptionsQueryRequest.displayAttr)[0];
    });

    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.TOOLTIPS').subscribe(res => this.asTooltipLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.REF_UP').subscribe(res => this.refsUpLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.TOOLTIPS').subscribe(res => this.sortGoodLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.REF_UP').subscribe(res => this.showGDEXLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.ICON_FOR').subscribe(res => this.iconForOneLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.ALLOW_MULT').subscribe(res => this.allowMultiLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.COPYING_CLIP').subscribe(res => this.flashCopingLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.CHECK_SEL_LINES').subscribe(res => this.checkSelLinesLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.SHOW_LINE').subscribe(res => this.showLinesNumLabel = res);
    this.translateService.stream('PAGE.CONCORDANCE.VIEW_OPTIONS.SHORT_LONG').subscribe(res => this.shortLongRefLabel = res);
  }

  public clickChangeViewOption(): void {
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST, JSON.stringify(this.viewOptionsQueryRequest));
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickKwic(): void {

  }

  public clickSentence(): void {

  }

}
