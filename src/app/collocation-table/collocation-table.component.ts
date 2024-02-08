import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription, timer } from 'rxjs';
import { REQUEST_TYPE } from '../common/query-constants';
import { CollocationItem } from '../model/collocation-item';
import { FieldRequest } from '../model/field-request';
import { ErrorMessagesService } from '../services/error-messages.service';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';
import { QueryRequest } from '../model/query-request';
import { CSV_PAGINATION } from '../model/constants';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { HTTP } from '../common/constants';
import { DOWNLOAD_CSV } from '../common/routes-constants';
import { ExportCsvService } from '../services/export-csv.service';
import { InstallationService } from '../services/installation.service';
import * as _ from 'lodash';


const COLLOCATION = 'collocation';
@Component({
  selector: 'app-collocation-table',
  templateUrl: './collocation-table.component.html',
  styleUrls: ['./collocation-table.component.scss']
})
export class CollocationTableComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = [];
  @Input() public visible = false;

  public colHeader: Array<string> = [];
  public sortField = '';
  public loading = false;
  public totalResults = 0;
  public collocations: Array<CollocationItem> = [];
  public fieldRequest: FieldRequest | null = null;
  public noResultFound = true;
  public faSortAmountDown = faSortAmountDown;
  public dlgVisible = false;
  public progressStatus = 0;

  private readonly queryResponseSubscription: Subscription;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly queryRequestService: QueryRequestService,
    private readonly exportCsvService: ExportCsvService,
    private readonly installationServices: InstallationService
  ) {
    this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse) {
        if (queryResponse.error && queryResponse.errorResponse && queryResponse.errorResponse.errorCode === 500) {
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
      this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.COLLOCATION_REQUEST;
      this.loadResultService.loadResults([this.fieldRequest], event);
    }
  }

  public showDialog() {
    this.dlgVisible = true;
    this.downloadCsv();
  }

  private downloadCsv(): void {
    let timeInterval: Subscription | null = null;
    let previousProgressValue = 0;
    const stopPolling = new Subject();
    const queryRequest: QueryRequest = _.cloneDeep(
      this.queryRequestService.getQueryRequest()
    );
    if (queryRequest) {
      queryRequest.collocationQueryRequest!.resultSize = this.totalResults;

      queryRequest.end = CSV_PAGINATION;
      this.exportCsvService.exportCvs(queryRequest).subscribe((uuid) => {
        const endpoint = this.installationServices.getCompleteEndpoint(
          queryRequest.corpus,
          HTTP
        );
        const downloadUrl = `${endpoint}/${DOWNLOAD_CSV}/${COLLOCATION}/${uuid}`;
        //polling on csv progress status
        timeInterval = timer(1000, 2000)
          .pipe(
            switchMap(() =>
              this.exportCsvService.getCsvProgressValue(
                queryRequest.corpus,
                uuid
              )
            ),
            tap((res) => {
              if (res.status === 'OK' || res.status === 'KO') {
                this.dlgVisible = false;
                this.exportCsvService.download(downloadUrl).then();
                stopPolling.next();
              } else if (res.status === 'KK') {
                this.progressStatus = previousProgressValue;
              } else {
                previousProgressValue = +res.status!;
                this.progressStatus = +res.status!;
              }
            }),
            takeUntil(stopPolling)
          )
          .subscribe();
      });
    }
  }


  private setColumnHeaders(): void {
    const collocationSortingParams = this.loadResultService.getCollocationSortingParams();
    this.colHeader = collocationSortingParams.colHeader;
    this.sortField = collocationSortingParams.headerSortBy;
  }


}
