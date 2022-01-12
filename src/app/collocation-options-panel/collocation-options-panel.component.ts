import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CollocationOptionsQueryRequest } from '../model/collocation-options-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { INSTALLATION_LIST } from '../utils/lookup-tab';

const COLL_OPTIONS_QUERY_REQUEST = 'collocationOptionsQueryRequest';
@Component({
  selector: 'app-collocation-options-panel',
  templateUrl: './collocation-options-panel.component.html',
  styleUrls: ['./collocation-options-panel.component.scss']
})
export class CollocationOptionsPanelComponent {

  @Input() public showRightButton = false;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public collocationOptionsQueryRequest: CollocationOptionsQueryRequest;
  public attributeList: KeyValueItem[] = [
    new KeyValueItem('T_SCORE', 'T_SCORE'),
    new KeyValueItem('MI', 'MI'), new KeyValueItem('MI3', 'MI3'),
    new KeyValueItem('LOG', 'LOG'), new KeyValueItem('MIN', 'MIN'),
    new KeyValueItem('LOG_DICE', 'LOG_DICE'), new KeyValueItem('MI_LOG', 'MI_LOG')
  ];

  constructor() {
    const collOptReq = localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST);
    const inst = INSTALLATION_LIST.find(i => i.index === environment.installation);
    this.collocationOptionsQueryRequest = collOptReq ?
      JSON.parse(collOptReq) :
      inst && inst.startup.collocationOptionsQueryRequest;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickCollocationOption(): void {
    localStorage.setItem(COLL_OPTIONS_QUERY_REQUEST, JSON.stringify(this.collocationOptionsQueryRequest));
  }

}
