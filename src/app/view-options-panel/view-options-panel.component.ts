import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ButtonItem } from '../model/button-item';
import {
  OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC
} from '../model/constants';
import { LookUpObject } from '../model/lookup-object';
import { QueryRequest, ViewOptionQueryRequest } from '../model/query-request';
import { CORPORA_LIST } from '../utils/lookup-tab';
import { ViewOptionsPanelService } from './view-options-panel.service';

const VIEW_OPTION_QUERY_REQUEST = 'viewOptionQueryRequest';
@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})

export class ViewOptionsPanelComponent implements OnInit {

  @Input() public corpus: string;

  public attributeChekBox: ButtonItem[] = [];
  public displayAttr: ButtonItem[];
  public selectedDisplayAttr: ButtonItem;
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

  public viewOptionQueryRequest: ViewOptionQueryRequest;

  private corpusAttributes: LookUpObject[];
  private queryRequest: QueryRequest;

  constructor(
    private readonly translateService: TranslateService,
    private readonly viewOptionPanelService: ViewOptionsPanelService
  ) { }

  ngOnInit(): void {
    this.viewOptionQueryRequest = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(VIEW_OPTION_QUERY_REQUEST)) : CORPORA_LIST[environment.corpora].viewOptionsQueryRequest;
    this.corpusAttributes = this.viewOptionPanelService.getAttributesByCorpus(this.corpus);
    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.corpusAttributes.forEach(attribute =>
        this.attributeChekBox.push(new ButtonItem(attribute.value, this.translateService.instant(attribute.viewValue))));

      this.displayAttr = [
        new ButtonItem(OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, this.translateService.instant('PAGE.CONCORDANCE.OPTION.FOR_EACH_TOKEN')),
        new ButtonItem(OPTIONAL_DISPLAY_ATTR_URL_KWIC, this.translateService.instant('PAGE.CONCORDANCE.OPTION.KWIC_TOKEN'))
      ];
      this.selectedDisplayAttr = this.displayAttr.filter(da => da.key === this.viewOptionQueryRequest.displayAttr)[0];

      this.asTooltipLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.TOOLTIPS');
      this.refsUpLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.REF_UP');
      this.sortGoodLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.TOOLTIPS');
      this.showGDEXLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.REF_UP');
      this.iconForOneLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.ICON_FOR');
      this.allowMultiLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.ALLOW_MULT');
      this.flashCopingLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.COPYING_CLIP');
      this.checkSelLinesLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.CHECK_SEL_LINES');
      this.showLinesNumLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.SHOW_LINE');
      this.shortLongRefLabel = this.translateService.instant('PAGE.CONCORDANCE.OPTION.SHORT_LONG');
    });


  }

  public clickChangeViewOption(): void {
    console.log('vai');
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST, JSON.stringify(this.viewOptionQueryRequest));
  }

}
