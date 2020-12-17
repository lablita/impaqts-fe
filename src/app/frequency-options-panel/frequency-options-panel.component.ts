import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ButtonItem } from '../model/button-item';
import { FIRST, FOURTH, L1, L2, L3, L4, L5, L6, NODE, R1, R2, R3, R4, R5, R6, SECOND, THIRD } from '../model/constants';
import { DropdownItem } from '../model/dropdown-item';
import { FreqOptionsQueryRequest } from '../model/freq-options-query_request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const FREQ_OPTIONS_QUERY_REQUEST = 'freqOptionsQueryRequest';

@Component({
  selector: 'app-frequency-options-panel',
  templateUrl: './frequency-options-panel.component.html',
  styleUrls: ['./frequency-options-panel.component.scss']
})
export class FrequencyOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public freqOptionsQueryRequest: FreqOptionsQueryRequest;

  public attributeList: DropdownItem[];
  public levels: ButtonItem[];
  public selectedLevel: ButtonItem;
  public selectedAttribute: DropdownItem;
  public selectedMultiAttribute: DropdownItem[];
  public ignoreCase: boolean[];
  public positionList: DropdownItem[];
  public selectedPosition: DropdownItem[];
  public ignoreCaseLabel: string;
  public includeCatLabel: string;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.ignoreCase = [false, false, false, false];

    this.freqOptionsQueryRequest = localStorage.getItem(FREQ_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(FREQ_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].freqOptionsQueryRequest;

    this.translateService.get('PAGE.CONCORDANCE.WORD').subscribe(word => {
      this.attributeList = [
        new DropdownItem('word', word),
        new DropdownItem('tag', this.translateService.instant('PAGE.CONCORDANCE.TAG')),
        new DropdownItem('lemma', this.translateService.instant('PAGE.CONCORDANCE.LEMMA')),
        new DropdownItem('word_lc', this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.WORD_LC')),
        new DropdownItem('lemma_lc', this.translateService.instant('PAGE.CONCORDANCE.LEMMA_LC')),
      ];

      this.includeCatLabel = this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.INCLUDE_CAT');

      this.levels = [
        new ButtonItem(FIRST, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.FIRST_LEVEL')),
        new ButtonItem(SECOND, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.SECOND_LEVEL')),
        new ButtonItem(THIRD, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.THIRD_LEVEL')),
        new ButtonItem(FOURTH, this.translateService.instant('PAGE.CONCORDANCE.FREQ_OPTIONS.FOURTH_LEVEL'))
      ];

      this.positionList = [
        new DropdownItem(L6, L6),
        new DropdownItem(L5, L5),
        new DropdownItem(L4, L4),
        new DropdownItem(L3, L3),
        new DropdownItem(L2, L2),
        new DropdownItem(L1, L1),
        new DropdownItem(NODE, NODE),
        new DropdownItem(R6, R6),
        new DropdownItem(R5, R5),
        new DropdownItem(R4, R4),
        new DropdownItem(R3, R3),
        new DropdownItem(R2, R2),
        new DropdownItem(R1, R1)
      ];

      this.selectedMultiAttribute = [
        new DropdownItem('word', word),
        new DropdownItem('word', word),
        new DropdownItem('word', word),
        new DropdownItem('word', word)
      ];

      this.selectedPosition = [
        new DropdownItem(NODE, NODE),
        new DropdownItem(NODE, NODE),
        new DropdownItem(NODE, NODE),
        new DropdownItem(NODE, NODE)
      ];
    });

  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickFreqOption(): void {

  }

}
