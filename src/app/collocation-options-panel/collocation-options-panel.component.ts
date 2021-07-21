import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { CollocationOptionsQueryRequest } from '../model/collocation-options-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const COLL_OPTIONS_QUERY_REQUEST = 'collocationOptionsQueryRequest';

const showList = ['T_SCORE', 'MI', 'MI3', 'LOG', 'MIN', 'LOG_DICE', 'MI_LOG'];
@Component({
  selector: 'app-collocation-options-panel',
  templateUrl: './collocation-options-panel.component.html',
  styleUrls: ['./collocation-options-panel.component.scss']
})
export class CollocationOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public collocationOptionsQueryRequest: CollocationOptionsQueryRequest;
  public corpusAttributes: KeyValueItem[];

  public attributeList: KeyValueItem[] = [];

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {

    this.translateService.stream('PAGE.CONCORDANCE.COLLOCATION_OPTIONS.T_SCORE').subscribe(res => {
      showList.forEach((show, index) => {
        if (index === 0) {
          this.attributeList = [];
          this.attributeList.push(new KeyValueItem(show, res));
        } else {
          this.translateService.stream('PAGE.CONCORDANCE.COLLOCATION_OPTIONS.' + show).subscribe(r =>
            this.attributeList.push(new KeyValueItem(show, r))
          );
        }
      });
    });

    this.collocationOptionsQueryRequest = localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].collocationOptionsQueryRequest;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickCollocationOption(): void {
    localStorage.setItem(COLL_OPTIONS_QUERY_REQUEST, JSON.stringify(this.collocationOptionsQueryRequest));
  }

}