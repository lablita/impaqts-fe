import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ButtonItem } from '../model/button-item';
import { ARF, CHANGE_OUT, DOC_COUNTS, HIT_COUNTS, KEYWORD, SIMPLE } from '../model/constants';
import { DropdownItem } from '../model/dropdown-item';
import { LookUpObject } from '../model/lookup-object';
import { WordListOptionsQueryRequest } from '../model/word-list-options-query-request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const WORD_LIST_OPTIONS_QUERY_REQUEST = 'wordListOptionsQueryRequest';
@Component({
  selector: 'app-word-list-options-panel',
  templateUrl: './word-list-options-panel.component.html',
  styleUrls: ['./word-list-options-panel.component.scss'],
  providers: [MessageService]
})
export class WordListOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Input() public corpusAttributes: LookUpObject[];
  @Input() public textTypesAttributes: LookUpObject[];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  public fileUploadedInfo: string;
  public nonWords: string;
  public frequencyFigures: ButtonItem[] = [];
  public selectedFrequencyFigure: ButtonItem;
  public outputTypes: ButtonItem[] = [];
  public selectedOutputType: ButtonItem;
  public subcorpusList: DropdownItem[] = [];
  public selectedSubcorpus: DropdownItem;
  // public searchAttrList: DropdownItem[] = [];
  public searchAttrList: {}[] = [];
  public selectedSearchAttr: DropdownItem;
  public nGram: string;
  public valueOfList: DropdownItem[] = [];
  public selectedValueOf: DropdownItem;
  public rareWordsList: DropdownItem[] = [];
  public selectedRareWords: DropdownItem;


  constructor(
    private readonly translateService: TranslateService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.searchAttrList.push({
      label: 'positional attributes',
      items: this.corpusAttributes
    }, {
      label: 'Text types',
      items: this.textTypesAttributes
    }
    )

    this.valueOfList = [
      new DropdownItem('2', '2'),
      new DropdownItem('3', '3'),
      new DropdownItem('4', '4'),
      new DropdownItem('5', '5'),
      new DropdownItem('6', '6'),
    ];
    this.rareWordsList = [
      new DropdownItem('0,01', '0,01'),
      new DropdownItem('0,1', '0,1'),
      new DropdownItem('1', '1'),
      new DropdownItem('10', '10'),
      new DropdownItem('100', '100'),
      new DropdownItem('1000', '1000'),
      new DropdownItem('10000', '10000'),
      new DropdownItem('100000', '100000'),
    ];
    this.wordListOptionsQueryRequest = localStorage.getItem(WORD_LIST_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(WORD_LIST_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].wordListOptionsQueryRequest;
    this.translateService.get('PAGE.CONCORDANCE.FILE_UPLOADED').subscribe(translated => {
      this.fileUploadedInfo = translated;
      this.nonWords = this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.NON_WORDS');
      this.nGram = this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.N_GRAM');

      this.frequencyFigures = [
        new ButtonItem(HIT_COUNTS, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.HIT_COUNTS')),
        new ButtonItem(DOC_COUNTS, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.DOC_COUNTS')),
        new ButtonItem(ARF, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.ARF'))
      ];

      this.outputTypes = [
        new ButtonItem(SIMPLE, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.SIMPLE')),
        new ButtonItem(KEYWORD, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.KEYWORD')),
        new ButtonItem(CHANGE_OUT, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.CHANGE_OUT'))
      ];
    });

  }

  public clickWordListOption(): void {

  }

  public onWhiteListBasicUpload(event): void {
    this.messageService.add({ severity: 'info', summary: this.fileUploadedInfo, detail: '' });
  }

  public onBlackListBasicUpload(event): void {
    this.messageService.add({ severity: 'info', summary: this.fileUploadedInfo, detail: '' });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public dropdownRareWords(): void {
    this.wordListOptionsQueryRequest.commonWords = parseFloat(this.selectedRareWords.code);
  }

}
