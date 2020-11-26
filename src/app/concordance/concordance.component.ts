import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ButtonItem } from '../model/button-item';
import {
  ALL, ANY, BOTH, CHARACTER, CQL, LEFT, LEMMA,
  NONE,




  PHRASE, REPUBBLICA, RIGHT, SIMPLE,
  WORD
} from '../model/constants';
import { Corpus, DropdownItem } from '../model/dropdown-item';
import { ViewOptionPanelComponent } from '../view-option-panel/view-option-panel.component';



@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit {
  public subHeader = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';


  @ViewChild('viewOptionPanel') private pwdInput: ViewOptionPanelComponent;

  public corpusList: Corpus[];
  public selectedCorpus: Corpus;
  public corp = REPUBBLICA;
  public dropdownActive = false;

  public windows: DropdownItem[];
  public selectedWindow: DropdownItem;
  public items: DropdownItem[];
  public selectedItem: DropdownItem;
  public tokens: DropdownItem[] = [];
  public selectedToken: DropdownItem;

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

  public dropdownCorpus(): void {
    if (!!this.selectedCorpus) {
      this.dropdownActive = false;
    }
  }


}
