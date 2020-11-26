import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ButtonItem } from '../model/button-item';
import {
  OPTIONAL_AS_TOOLTIP_URL_ON, OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC, OPTIONAL_REFS_UP_URL_ON
} from '../model/constants';
import { LookUpObject } from '../model/lookup-object';
import { ViewOptionPanelService } from './view-option-panel.service';

@Component({
  selector: 'app-view-option-panel',
  templateUrl: './view-option-panel.component.html',
  styleUrls: ['./view-option-panel.component.scss']
})
export class ViewOptionPanelComponent implements OnInit {

  @Input() public corpus: string;


  public attributeChekBox: ButtonItem[] = [];
  public selectedAttributes: string[] = [];
  public displayAttr: ButtonItem[];
  public selectedDisplayAttr: ButtonItem;
  public asTooltip: ButtonItem;
  public selectedAsTooltip: string;

  public setstructures: string[] = [];
  public setReferences: string[] = [];
  public refsUp: ButtonItem;
  public selectedRefsUp: string;

  public pageSize: number;
  public kwicContext: number;
  public sortGood: ButtonItem;
  public showGDEX: ButtonItem;
  public numLines: number;

  private corpusAttributes: LookUpObject[];


  constructor(
    private readonly translateService: TranslateService,
    private readonly viewOptionPanelService: ViewOptionPanelService
  ) {
  }

  ngOnInit(): void {
    console.log('corpus: ' + this.corpus);
    this.corpusAttributes = this.viewOptionPanelService.getAttributesByCorpus(this.corpus);
    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.corpusAttributes.forEach(attribute =>
        this.attributeChekBox.push(new ButtonItem(attribute.value, this.translateService.instant(attribute.viewValue))));

      this.displayAttr = [
        new ButtonItem(OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, this.translateService.instant('PAGE.CONCORDANCE.OPTION.FOR_EACH_TOKEN')),
        new ButtonItem(OPTIONAL_DISPLAY_ATTR_URL_KWIC, this.translateService.instant('PAGE.CONCORDANCE.OPTION.KWIC_TOKEN'))
      ];
      this.selectedDisplayAttr = this.displayAttr[0];

      this.asTooltip = new ButtonItem(OPTIONAL_AS_TOOLTIP_URL_ON, this.translateService.instant('PAGE.CONCORDANCE.OPTION.TOOLTIPS'));
      this.refsUp = new ButtonItem(OPTIONAL_REFS_UP_URL_ON, this.translateService.instant('PAGE.CONCORDANCE.OPTION.REF_UP'));
      this.sortGood = new ButtonItem('0', this.translateService.instant('PAGE.CONCORDANCE.OPTION.TOOLTIPS'));
      this.showGDEX = new ButtonItem('0', this.translateService.instant('PAGE.CONCORDANCE.OPTION.REF_UP'));
    });


  }

  public clickChangeViewOption(): void {
    console.log('vai');
  }

}
