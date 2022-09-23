import { Component, Input, OnInit } from '@angular/core';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { CollocationItem } from '../model/collocation-item';
import { FieldRequest } from '../model/field-request';
import { LoadResultsService } from '../services/load-results.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-collocation-table',
  templateUrl: './collocation-table.component.html',
  styleUrls: ['./collocation-table.component.scss']
})
export class CollocationTableComponent implements OnInit {

  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });
  @Input() public visible = false;

  public colHeader: Array<string> = Array.from<string>({ length: 0 });
  public sortField = '';
  public loading = false;
  public totalResults = 0;
  public collocations: Array<CollocationItem> = Array.from<CollocationItem>({ length: 0 });
  public fieldRequest: FieldRequest | null = null;
  public noResultFound = true;
  public faSortAmountDown = faSortAmountDown;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService
  ) {
    this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse && queryResponse.collocations.length > 0) {
        this.totalResults = queryResponse.currentSize;
        this.collocations = queryResponse.collocations;
        this.noResultFound = queryResponse.currentSize < 1;
      }
    });
    this.emitterService.makeCollocation.subscribe(fieldRequest => {
      this.loading = true;
      this.fieldRequest = fieldRequest;
      this.loadResultService.loadResults(fieldRequest);
    });
  }

  ngOnInit(): void {
  }

  public loadCollocations(event: any): void {
    if (this.fieldRequest) {
      this.loading = true;
      const collocationSortingParams = this.loadResultService.getCollocationSortingParams();
      this.colHeader = collocationSortingParams.colHeader;
      this.sortField = collocationSortingParams.headerSortBy;
      this.loadResultService.loadResults(this.fieldRequest, event);
    }
  }

}
