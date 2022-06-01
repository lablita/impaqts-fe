import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CollocationItem } from '../model/collocation-item';

@Component({
  selector: 'app-collocation-table',
  templateUrl: './collocation-table.component.html',
  styleUrls: ['./collocation-table.component.scss']
})
export class CollocationTableComponent implements OnInit {

  @Input() public visible = false;
  @Input() public loading = false; @Input() public initialPagination = 0;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });
  @Input() public colHeader: Array<string> = Array.from<string>({ length: 0 });
  @Input() public sortField = '';
  @Input() public sortOrder = -1;
  @Input() public totalResults = 0;
  @Input() public collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  @Output() public loadResults = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public loadCollocations(event: any): void {
    this.loadResults.emit(event);
  }

}
