import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropdownItem } from '../model/dropdown-item';
import { LookUpObject } from '../model/lookup-object';

@Component({
  selector: 'app-collocation-options-panel',
  templateUrl: './collocation-options-panel.component.html',
  styleUrls: ['./collocation-options-panel.component.scss']
})
export class CollocationOptionsPanelComponent implements OnInit {

  @Input() public showRightButton: boolean;
  @Input() public corpusAttributes: LookUpObject[];
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public attributeList: DropdownItem[] = [];
  public selectedMultiAttribute: DropdownItem[];

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.corpusAttributes?.length > 0) {
      this.corpusAttributes.forEach(ca => this.attributeList.push(new DropdownItem(ca.value, ca.viewValue)));
    }
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

}
