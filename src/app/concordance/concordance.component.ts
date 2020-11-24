import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ButtonItem } from '../model/button-item';
import {
  ALL, ANY, BOTH, CHARACTER, CQL, LEFT, LEMMA,
  NONE, OPTIONAL_AS_TOOLTIP_URL_ON, OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC,


  OPTIONAL_REFS_UP_URL_ON, OPTION_ATTR_URL_LEMMA, OPTION_ATTR_URL_LEMMA_LC, OPTION_ATTR_URL_TAG,
  OPTION_ATTR_URL_WORLD, OPTION_ATTR_URL_WORLD_LC, PHRASE, RIGHT, SIMPLE,
  WORD
} from '../model/constants';
import { Corpus, DropdownItem } from '../model/dropdown-item';



@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit {
  public subHeader = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  public corpusList: Corpus[];
  public selectedCorpus: Corpus;


  public windows: DropdownItem[];
  public selectedWindow: DropdownItem;
  public items: DropdownItem[];
  public selectedItem: DropdownItem;
  public tokens: DropdownItem[] = [];
  public selectedToken: DropdownItem;

  /** VIEW OPTION*/
  public attributeChekBox: ButtonItem[];
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


  /** */


  public queryTypes: ButtonItem[];
  public selectedQueryType: ButtonItem;
  public selectCorpus: string;

  public LEMMA = LEMMA;
  public PHRASE = PHRASE;
  public WORD = WORD;
  public CHARACTER = CHARACTER;
  public CQL = CQL;

  public titleOption: string;

  public simple: string;
  public lemma: string;
  public phrase: string;
  public word: string;
  public character: string;
  public cql: string;

  public queryTypeStatus: boolean;
  public contextStatus: boolean;
  public textTypeStatus: boolean;

  public attributesSelection: string[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.queryTypeStatus = false;
    this.contextStatus = false;
    this.textTypeStatus = false;

    for (let i = 1; i < 6; i++) {
      this.tokens.push(new DropdownItem('' + i, '' + i));
    }
    this.tokens.push(new DropdownItem('7', '7'));
    this.tokens.push(new DropdownItem('10', '10'));
    this.tokens.push(new DropdownItem('15', '15'));
    this.selectedToken = this.tokens[4];

    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.selectCorpus = this.translateService.instant('PAGE.CONCORDANCE.SELECT_CORPUS');
      this.corpusList = this.route.snapshot.data.corpusList;
      this.queryTypes = [
        new ButtonItem(SIMPLE, simple),
        new ButtonItem(LEMMA, this.translateService.instant('PAGE.CONCORDANCE.LEMMA')),
        new ButtonItem(PHRASE, this.translateService.instant('PAGE.CONCORDANCE.PHRASE')),
        new ButtonItem(WORD, this.translateService.instant('PAGE.CONCORDANCE.WORD')),
        new ButtonItem(CHARACTER, this.translateService.instant('PAGE.CONCORDANCE.CHARACTER')),
        new ButtonItem(CQL, this.translateService.instant('PAGE.CONCORDANCE.CQL'))
      ];
      this.selectedQueryType = this.queryTypes[0];

      this.windows = [
        new DropdownItem(LEFT, this.translateService.instant('PAGE.CONCORDANCE.LEFT')),
        new DropdownItem(RIGHT, this.translateService.instant('PAGE.CONCORDANCE.RIGHT')),
        new DropdownItem(BOTH, this.translateService.instant('PAGE.CONCORDANCE.BOTH'))
      ];
      this.selectedWindow = this.windows[2];

      this.items = [
        new DropdownItem(ALL, this.translateService.instant('PAGE.CONCORDANCE.ALL')),
        new DropdownItem(ANY, this.translateService.instant('PAGE.CONCORDANCE.ANY')),
        new DropdownItem(NONE, this.translateService.instant('PAGE.CONCORDANCE.NONE'))
      ];
      this.selectedItem = this.items[0];

      this.attributeChekBox = [
        new ButtonItem(OPTION_ATTR_URL_WORLD, this.translateService.instant('PAGE.CONCORDANCE.WORD')),
        new ButtonItem(OPTION_ATTR_URL_TAG, this.translateService.instant('PAGE.CONCORDANCE.TAG')),
        new ButtonItem(OPTION_ATTR_URL_LEMMA, this.translateService.instant('PAGE.CONCORDANCE.LEMMA')),
        new ButtonItem(OPTION_ATTR_URL_WORLD_LC, this.translateService.instant('PAGE.CONCORDANCE.OPTION.WORD_LC')),
        new ButtonItem(OPTION_ATTR_URL_LEMMA_LC, this.translateService.instant('PAGE.CONCORDANCE.OPTION.LEMMA_LC'))
      ];

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

    // TODO
    this.titleOption = 'PAGE.CONCORDANCE.OPTION.VIEW_OPTION';

  }

  public clickQueryType(): void {
    this.queryTypeStatus = !this.queryTypeStatus;
  }

  public clickContext(): void {
    this.contextStatus = !this.contextStatus;
  }

  public clickTextType(): void {
    this.textTypeStatus = !this.textTypeStatus;
  }

  public clickMakeConcordance(): void {

  }

  public clickClearAll(): void {

  }


}
