import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ButtonItem } from '../model/button-item';
import { FIRST, L1, L2, L3, LEFT, NODE, R1, R2, R3, RIGHT, SECOND, THIRD } from '../model/constants';
import { DropdownItem } from '../model/dropdown-item';
import { SortOptionsQueryRequest } from '../model/sort-options-query-request';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const SORT_OPTIONS_QUERY_REQUEST = 'sortOptionsQueryRequest';

@Component({
  selector: 'app-sort-options-panel',
  templateUrl: './sort-options-panel.component.html',
  styleUrls: ['./sort-options-panel.component.scss']
})
export class SortOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public sortOptionsQueryRequest: SortOptionsQueryRequest;

  public attributeList: DropdownItem[];
  public selectedAttribute: DropdownItem;
  public selectedMultiAttribute: DropdownItem[];
  public sortKeys: ButtonItem[];
  public selectedSortKey: ButtonItem;
  public ignoreCaseLabel: string;
  public backwordLabel: string;
  public levels: ButtonItem[];
  public selectedLevel: ButtonItem;
  public positionList: DropdownItem[];
  public selectedPosition: DropdownItem[];
  public ignoreCase: boolean[];
  public backward: boolean[];

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.ignoreCase = [false, false, false];
    this.backward = [false, false, false];

    this.sortOptionsQueryRequest = localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(SORT_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].sortOptionsQueryRequest;

    this.translateService.get('PAGE.CONCORDANCE.WORD').subscribe(word => {
      this.attributeList = [
        new DropdownItem('word', word),
        new DropdownItem('tag', this.translateService.instant('PAGE.CONCORDANCE.TAG')),
        new DropdownItem('lemma', this.translateService.instant('PAGE.CONCORDANCE.LEMMA')),
        new DropdownItem('word_lc', this.translateService.instant('PAGE.CONCORDANCE.VIEW_OPTIONS.WORD_LC')),
        new DropdownItem('lemma_lc', this.translateService.instant('PAGE.CONCORDANCE.LEMMA_LC')),
      ];

      this.ignoreCaseLabel = this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.IGNORE_CASE');
      this.backwordLabel = this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.BACKWARD');

      this.sortKeys = [
        new ButtonItem(LEFT, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.LEFT_CONTEXT')),
        new ButtonItem(NODE, this.translateService.instant('MENU.NODE')),
        new ButtonItem(RIGHT, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.RIGHT_CONTEXT'))
      ];

      this.levels = [
        new ButtonItem(FIRST, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.FIRST_LEVEL')),
        new ButtonItem(SECOND, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.SECOND_LEVEL')),
        new ButtonItem(THIRD, this.translateService.instant('PAGE.CONCORDANCE.SORT_OPTIONS.THIRD_LEVEL'))
      ];

      this.positionList = [
        new DropdownItem(L3, L3),
        new DropdownItem(L2, L2),
        new DropdownItem(L1, L1),
        new DropdownItem(NODE, NODE),
        new DropdownItem(R3, R3),
        new DropdownItem(R2, R2),
        new DropdownItem(R1, R1)
      ];

      this.selectedMultiAttribute = [
        new DropdownItem('word', word),
        new DropdownItem('word', word),
        new DropdownItem('word', word)
      ];

      this.selectedPosition = [
        new DropdownItem(NODE, NODE),
        new DropdownItem(NODE, NODE),
        new DropdownItem(NODE, NODE),
      ];
    });
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickSortOption(): void {

  }

}
