import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { HIT_COUNTS } from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
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

  @Input() public showRightButton: boolean = false;
  @Input() public corpusAttributes: KeyValueItem[] | null = null
  @Input() public textTypesAttributes: KeyValueItem[] | null = null
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public wordListOptionsQueryRequest: WordListOptionsQueryRequest;
  public fileUploadedInfo: string | null = null;
  public nonWords: string = '';
  public frequencyFigures: KeyValueItem[] = [];
  public selectedFrequencyFigure: KeyValueItem | null = null;
  public outputTypes: KeyValueItem[] = [];
  public selectedOutputType: KeyValueItem | null = null;
  public subcorpusList: KeyValueItem[] = [];
  public selectedSubcorpus: KeyValueItem | null = null;
  public searchAttrList: {}[] = [];
  public selectedSearchAttr: KeyValueItem | null = null;
  public nGram: string = '';
  public valueOfList: KeyValueItem[] = [];
  public selectedValueOf: KeyValueItem | null = null;
  public rareWordsList: KeyValueItem[] = [];
  public selectedRareWords: KeyValueItem | null = null;
  public attributeList: DropdownIG[] = [];
  public textTypeList: DropdownIG[] = [];


  constructor(
    private readonly translateService: TranslateService,
    private readonly messageService: MessageService
  ) {
    this.wordListOptionsQueryRequest = WordListOptionsQueryRequest.getInstance();
  }

  ngOnInit(): void {
    if (this.corpusAttributes) {
      this.corpusAttributes.forEach(ca => { if (ca.value) { this.attributeList.push(new DropdownIG(ca.key, ca.value)); } });
    }
    if (this.textTypesAttributes) {
      this.textTypesAttributes.forEach(ca => { if (ca.value) { this.textTypeList.push(new DropdownIG(ca.key, ca.value)); } });
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
      new KeyValueItem('2', '2'),
      new KeyValueItem('3', '3'),
      new KeyValueItem('4', '4'),
      new KeyValueItem('5', '5'),
      new KeyValueItem('6', '6'),
    ];
    this.rareWordsList = [
      new KeyValueItem('0,01', '0,01'),
      new KeyValueItem('0,1', '0,1'),
      new KeyValueItem('1', '1'),
      new KeyValueItem('10', '10'),
      new KeyValueItem('100', '100'),
      new KeyValueItem('1000', '1000'),
      new KeyValueItem('10000', '10000'),
      new KeyValueItem('100000', '100000'),
    ];
    const wordList = localStorage.getItem(WORD_LIST_OPTIONS_QUERY_REQUEST);
    const inst = INSTALLATION_LIST.find(i => i.index === environment.installation);
    if (wordList) {
      this.wordListOptionsQueryRequest = wordList ?
        JSON.parse(wordList) :
        inst?.startup.wordListOptionsQueryRequest;
    }
    this.translateService.stream('PAGE.CONCORDANCE.FILE_UPLOADED').subscribe(res => this.fileUploadedInfo = res);
    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.NON_WORDS').subscribe(res => this.nonWords = res);
    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.N_GRAM').subscribe(res => this.nGram = res);

    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.HIT_COUNTS').subscribe(res => {
      this.frequencyFigures = [];
      this.frequencyFigures.push(new KeyValueItem(HIT_COUNTS, res))
      this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.NON_WORDS').subscribe(res => this.frequencyFigures.push(new KeyValueItem(HIT_COUNTS, res)));
      this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.ARF').subscribe(res => this.frequencyFigures.push(new KeyValueItem(HIT_COUNTS, res)));
    });

    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.SIMPLE').subscribe(res => {
      this.outputTypes = [];
      this.outputTypes.push(new KeyValueItem(HIT_COUNTS, res))
    });
    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.KEYWORD').subscribe(res => this.outputTypes.push(new KeyValueItem(HIT_COUNTS, res)));
    this.translateService.stream('PAGE.CONCORDANCE.WORD_OPTIONS.CHANGE_OUT').subscribe(res => this.outputTypes.push(new KeyValueItem(HIT_COUNTS, res)));

  }

  public clickWordListOption(): void {

  }

  public onWhiteListBasicUpload(event: any): void {
    this.messageService.add({ severity: 'info', summary: this.fileUploadedInfo ? this.fileUploadedInfo : '', detail: '' });
  }

  public onBlackListBasicUpload(event: any): void {
    this.messageService.add({ severity: 'info', summary: this.fileUploadedInfo ? this.fileUploadedInfo : '', detail: '' });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public dropdownRareWords(): void {
    if (this.wordListOptionsQueryRequest && this.selectedRareWords) {
      this.wordListOptionsQueryRequest.commonWords = parseFloat(this.selectedRareWords.key);
    }
  }

}
