import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ARF, CHANGE_OUT, DOC_COUNTS, HIT_COUNTS, KEYWORD, SIMPLE } from '../model/constants';
import { DropdownItem } from '../model/dropdown-item';
import { KeyValueItem } from '../model/key-value-item';
import { LookUpObject } from '../model/lookup-object';
import { WordListOptionsQueryRequest } from '../model/word-list-options-query-request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const WORD_LIST_OPTIONS_QUERY_REQUEST = 'wordListOptionsQueryRequest';
class DropdownIG {
  label: string;
  value: string;
  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}
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
  public frequencyFigures: KeyValueItem[] = [];
  public selectedFrequencyFigure: KeyValueItem;
  public outputTypes: KeyValueItem[] = [];
  public selectedOutputType: KeyValueItem;
  public subcorpusList: DropdownItem[] = [];
  public selectedSubcorpus: DropdownItem;
  public searchAttrList: {}[] = [];
  public selectedSearchAttr: DropdownItem;
  public nGram: string;
  public valueOfList: DropdownItem[] = [];
  public selectedValueOf: DropdownItem;
  public rareWordsList: DropdownItem[] = [];
  public selectedRareWords: DropdownItem;
  public attributeList: DropdownIG[] = [];
  public textTypeList: DropdownIG[] = [];


  constructor(
    private readonly translateService: TranslateService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.corpusAttributes?.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new DropdownIG(ca.value, ca.viewValue)));
    }
    if (this.corpusAttributes?.length > 0) {
      this.textTypesAttributes.forEach(ca => this.textTypeList.push(new DropdownIG(ca.value, ca.viewValue)));
    }

    this.searchAttrList.push(
      {
        label: 'Positional attributes',
        value: 'Positional attributes',
        items: this.attributeList
      }, {
      label: 'Text types',
      value: 'Text types',
      items: this.textTypeList
    });

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
        new KeyValueItem(HIT_COUNTS, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.HIT_COUNTS')),
        new KeyValueItem(DOC_COUNTS, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.DOC_COUNTS')),
        new KeyValueItem(ARF, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.ARF'))
      ];

      this.outputTypes = [
        new KeyValueItem(SIMPLE, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.SIMPLE')),
        new KeyValueItem(KEYWORD, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.KEYWORD')),
        new KeyValueItem(CHANGE_OUT, this.translateService.instant('PAGE.CONCORDANCE.WORD_OPTIONS.CHANGE_OUT'))
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
