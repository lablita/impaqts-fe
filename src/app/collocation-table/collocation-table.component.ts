import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { CollocationItem } from '../model/collocation-item';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-collocation-table',
  templateUrl: './collocation-table.component.html',
  styleUrls: ['./collocation-table.component.scss']
})
export class CollocationTableComponent implements OnInit {

  @Input() public loading = false;
  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });
  @Input() public colHeader: Array<string> = Array.from<string>({ length: 0 });
  @Input() public sortField = '';
  @Input() public totalResults = 0;
  @Input() public visible = false;
  @Input() public collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  @Output() public loadResults = new EventEmitter<any>();

  public faSortAmountDown = faSortAmountDown;

  constructor(
    private readonly emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.emitterService.makeCollocation.subscribe(() => this.loadResults.emit());
  }

  public loadCollocations(event: any): void {
    this.loadResults.emit(event);
  }

}
