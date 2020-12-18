import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class CollocationOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Input() public corpusAttributes: KeyValueItem[];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public collocationOptionsQueryRequest: CollocationOptionsQueryRequest;

  public attributeList: KeyValueItem[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.corpusAttributes?.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new KeyValueItem(ca.key, ca.value)));
    }

    this.collocationOptionsQueryRequest = localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(COLL_OPTIONS_QUERY_REQUEST)) :
      INSTALLATION_LIST[environment.installation].collocationOptionsQueryRequest;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickCollocationOption(): void {
    localStorage.setItem(COLL_OPTIONS_QUERY_REQUEST, JSON.stringify(this.collocationOptionsQueryRequest));
    console.log('ok');
  }

}