import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { ButtonItem } from '../model/button-item';
import {
  ALL, ANY, BOTH, CHARACTER, CQL, LEFT, LEMMA,
  NONE, PHRASE, RIGHT, SIMPLE, WORD, WORD_LIST
} from '../model/constants';
import { Corpus, DropdownItem } from '../model/dropdown-item';
import { CORPORA_LIST } from '../utils/lookup-tab';
import { ViewOptionsPanelComponent } from '../view-options-panel/view-options-panel.component';



@Component({
  selector: 'app-concordance',
  templateUrl: './concordance.component.html',
  styleUrls: ['./concordance.component.scss']
})
export class ConcordanceComponent implements OnInit {
  public subHeader = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

  @ViewChild('viewOptionsPanel') private pwdInput: ViewOptionsPanelComponent;

  public corpusList: Corpus[];
  public selectedCorpus: Corpus;
  public dropdownCorpusActive = false;

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

  public wordListOptionsLabel: string;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService
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

    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      if (event.item === WORD_LIST) {
        this.titleOption = this.wordListOptionsLabel;
      } else {
        this.titleOption = 'PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS';
      }
    });

    this.translateService.get('PAGE.CONCORDANCE.SIMPLE').subscribe(simple => {
      this.selectCorpus = this.translateService.instant('PAGE.CONCORDANCE.SELECT_CORPUS');
      this.corpusList = CORPORA_LIST[environment.corpora].corpusList;
      this.wordListOptionsLabel = this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.WORD_OPTIONS');
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
    this.titleOption = 'PAGE.CONCORDANCE.VIEW_OPTIONS.VIEW_OPTIONS';

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
    if (this.dropdownCorpusActive && !this.selectedCorpus) {
      this.dropdownCorpusActive = false;
    }
  }


}
