import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CollocationItem } from '../model/collocation-item';
import { FieldRequest } from '../model/field-request';
import { ErrorMessagesService } from '../services/error-messages.service';
import { LoadResultsService } from '../services/load-results.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-collocation-table',
  templateUrl: './collocation-table.component.html',
  styleUrls: ['./collocation-table.component.scss']
})
export class CollocationTableComponent implements AfterViewInit, OnDestroy, OnChanges {

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

  private readonly queryResponseSubscription: Subscription;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    private readonly errorMessagesService: ErrorMessagesService
  ) {
    this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      if (queryResponse) {
        this.loading = false;
        if (queryResponse.error) {
          const errorMessage = { severity: 'error', summary: 'Errore', detail: 'Errore I/O sul server, i dati potrebbero non essere attendibili' };
          this.errorMessagesService.sendError(errorMessage);
        } else {
          this.setColumnHeaders();
          if (queryResponse.collocations.length > 0) {
            this.totalResults = queryResponse.currentSize;
            this.collocations = queryResponse.collocations;
            this.noResultFound = queryResponse.currentSize < 1;
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.emitterService.makeCollocation.subscribe(fieldRequest => {
      this.loading = true;
      this.fieldRequest = fieldRequest;
      this.loadResultService.loadResults([fieldRequest]);
    });
  }

  ngOnDestroy(): void {
    if (this.queryResponseSubscription) {
      this.queryResponseSubscription.unsubscribe();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible.currentValue === false) {
      if (this.queryResponseSubscription) {
        this.queryResponseSubscription.unsubscribe();
      }
    }
  }


  public loadCollocations(event: any): void {
    if (this.fieldRequest) {
      this.loading = true;
      this.setColumnHeaders();
      this.loadResultService.loadResults([this.fieldRequest], event);
    }
  }

  private setColumnHeaders(): void {
    const collocationSortingParams = this.loadResultService.getCollocationSortingParams();
    this.colHeader = collocationSortingParams.colHeader;
    this.sortField = collocationSortingParams.headerSortBy;
  }


}
