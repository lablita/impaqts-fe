import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC
} from '../model/constants';
import { KeyValueItem } from '../model/key-value-item';
import { DEFAULT_VIEW_OPTIONS_QUERY_REQUEST, ViewOptionsQueryRequest } from '../model/view-options-query-request';

const VIEW_OPTION_QUERY_REQUEST = 'viewOptionQueryRequest';
@Component({
  selector: 'app-view-options-panel',
  templateUrl: './view-options-panel.component.html',
  styleUrls: ['./view-options-panel.component.scss']
})

export class ViewOptionsPanelComponent implements OnInit {

  @Input() public corpus: string | null | undefined = null;
  @Input() public corpusAttributes: Array<KeyValueItem> = [];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public attributeChekBox: Array<KeyValueItem> = [];
  public viewOptionsQueryRequest: ViewOptionsQueryRequest = ViewOptionsQueryRequest.getInstance();

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const voqr = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST);
    if (voqr) {
      this.viewOptionsQueryRequest = voqr ?
        JSON.parse(voqr) : DEFAULT_VIEW_OPTIONS_QUERY_REQUEST;
    }
    this.corpusAttributes.forEach((attribute, index) => {
      this.translateService.stream(attribute.value).subscribe({
        next: res => {
          if (index === 0) {
            this.attributeChekBox = [];
          }
          this.attributeChekBox.push(new KeyValueItem(attribute.key, res));
        }
      });
    });
  }

  public clickChangeViewOption(): void {
    localStorage.setItem(VIEW_OPTION_QUERY_REQUEST, JSON.stringify(this.viewOptionsQueryRequest));
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }
}
