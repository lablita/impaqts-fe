import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Message } from 'primeng/api';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  CONTEXT_TYPE_ALL,
  CONTEXT_WINDOW_LEFT,
  CONTEXT_WINDOW_RIGHT,
} from '../common/concordance-constants';
import { HTTP } from '../common/constants';
import {
  CHARACTER,
  CQL,
  LEMMA,
  PHRASE,
  REQUEST_TYPE,
  WORD,
} from '../common/query-constants';
import { DOWNLOAD_CSV, RESULT_CONCORDANCE } from '../common/routes-constants';
import { LEFT, MULTILEVEL, NODE, RIGHT } from '../common/sort-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { CSV_PAGINATION, SHUFFLE } from '../model/constants';
import {
  ContextConcordanceItem,
  ContextConcordanceQueryRequest,
} from '../model/context-concordance-query-request';
import { DescResponse } from '../model/desc-response';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { ReferencePositionResponse } from '../model/reference-position-response';
import { ResultContext } from '../model/result-context';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { AppInitializerService } from '../services/app-initializer.service';
import { LastResult } from '../services/dto/last-result';
import { ErrorMessagesService } from '../services/error-messages.service';
import { ExportCsvService } from '../services/export-csv.service';
import { InstallationService } from '../services/installation.service';
import { LastResultService } from '../services/last-result.service';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { ReferencePositionService } from '../services/reference-position.service';
import { WideContextService } from '../services/wide-context.service';
import {
  ConcordanceRequestPayload,
  EmitterService,
} from '../utils/emitter.service';

const SORT_LABELS = [
  new KeyValueItem('LEFT_CONTEXT', LEFT),
  new KeyValueItem('RIGHT_CONTEXT', RIGHT),
  new KeyValueItem('NODE_CONTEXT', NODE),
  new KeyValueItem('SHUFFLE_CONTEXT', SHUFFLE),
  new KeyValueItem('MULTILEVEL_CONTEXT', MULTILEVEL),
];

const CONCORDANCE = 'concordance';
@Component({
  selector: 'app-concordance-table',
  templateUrl: './concordance-table.component.html',
  styleUrls: ['./concordance-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConcordanceTableComponent
  implements AfterViewInit, OnDestroy, OnChanges {
  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = [];
  @Input() public visible = false;
  @Input() public isVisualQuery = false;
  @Output() public setContextFiledsFromBreadcrumbs = new EventEmitter<number>();

  public loading = false;
  public totalResults = 0;
  public firstItemTotalResults = 0;
  public first = 0;
  public kwicLines: Array<KWICline> = [];
  public noResultFound = true;
  public resultContext: ResultContext | null = null;
  public implStr: string | null = null;
  public typeStr: string | null = null;
  public functionStr: string | null = null;
  public commentStr: string | null = null;
  public displayModal = false;
  public videoUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/OBmlCZTF4Xs'
    );
  public sortOptions: string[] = [];
  public stripTags = KWICline.stripTags;
  public dlgVisible = false;

  public descriptions: Array<DescResponse> = [];
  public fieldRequests: Array<FieldRequest> = [];
  public queryType = REQUEST_TYPE.TEXTUAL_QUERY_REQUEST;
  public progressStatus = 0;
  public referencePositionResponse: ReferencePositionResponse | null = null;
  public referenceKeys: string[] = [];
  public queryTypeRequest = '';
  public isImpaqtsCustom = false;
  public firstTime = true;
  public queryTitle = 'Query';

  private readonly queryResponseSubscription: Subscription;
  private makeConcordanceRequestSubscription: Subscription | null = null;
  private currentStart = 0;
  private currentEnd = 0;
  private currentQueryId = '';

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    private readonly queryRequestService: QueryRequestService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly wideContextService: WideContextService,
    private readonly exportCsvService: ExportCsvService,
    private readonly installationServices: InstallationService,
    private readonly referencePositionService: ReferencePositionService,
    private readonly appInitializerService: AppInitializerService,
    private readonly lastResultService: LastResultService,
    private readonly menuEmitterService: MenuEmitterService
  ) {
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
    this.queryResponseSubscription = this.loadResultService
      .getQueryResponse$()
      .subscribe((queryResponse) => {
        this.loading = false;
        this.queryType = this.queryRequestService.getQueryRequest().queryType;
        if (queryResponse) {
          if (queryResponse.error && queryResponse.errorResponse) {
            const errorMessage = {
              severity: 'error',
              summary: 'Errore',
              detail:
                'Errore I/O sul server, i dati potrebbero non essere attendibili',
            };
            if (queryResponse.errorResponse.errorCode === 500) {
              this.errorMessagesService.sendError(errorMessage);
            } else if (queryResponse.errorResponse.errorCode === 400) {
              errorMessage.detail = queryResponse.errorResponse.errorMessage;
              this.errorMessagesService.sendError(errorMessage);
            }
            this.kwicLines = [];
            this.noResultFound = true;
          } else {
            if (queryResponse.id !== this.currentQueryId) {
              this.first = 0;
            }
            if (
              (queryResponse.id !== this.currentQueryId ||
                this.isDifferentPagination(
                  this.currentStart,
                  this.currentEnd,
                  queryResponse
                )) &&
              queryResponse.kwicLines?.length > 0
            ) {
              this.currentQueryId = queryResponse.id;
              console.log(queryResponse);
              if (
                queryResponse.descResponses &&
                queryResponse.descResponses.length > 0
              ) {
                // ultimo elemento delle descResponses ha il totale visualizzato
                this.totalResults =
                  queryResponse.descResponses[
                    queryResponse.descResponses.length - 1
                  ].size;
              }
              this.kwicLines = queryResponse.kwicLines;
              this.kwicLines = this.kwicLines.map((kl) => {
                if (!kl.videoUrl || !kl.videoUrl.startsWith('http')) {
                  kl.videoUrl = null;
                }
                return kl;
              });
              this.noResultFound = false;
              this.descriptions = queryResponse.descResponses;
            }
            if (queryResponse.currentSize === 0) {
              this.kwicLines = [];
              this.noResultFound = true;
            }
            this.firstItemTotalResults = queryResponse.currentSize;
            this.totalResults = queryResponse.currentSize;
          }
          this.currentStart = queryResponse.start;
          this.currentEnd = queryResponse.end;
          const lastResult = new LastResult(
            this.kwicLines,
            this.initialPagination,
            this.totalResults,
            this.first,
            this.fieldRequests
          );
          if (!this.isVisualQuery) {
            lastResult.queryType = this.queryRequestService.getQueryRequest().queryType;
            this.lastResultService.setLastResult(lastResult);
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.makeConcordanceRequestSubscription =
      this.emitterService.makeConcordanceRequestSubject.subscribe((res) => {
        const lastResult = this.lastResultService.getLastResult();
        if (lastResult.kwicLines && lastResult.totalResults > 0 && !this.isVisualQuery && this.queryRequestService.getQueryRequest().queryType === lastResult.queryType && !res.queryFromSortPanel) {
          this.kwicLines = [...lastResult.kwicLines];
          this.first = lastResult.first;
          this.initialPagination = lastResult.initialPagination;
          this.totalResults = lastResult.totalResults;
          if (lastResult.fieldRequest) {
            this.fieldRequests = lastResult.fieldRequest;
          }
          this.loading = false;
          this.noResultFound = false;
          this.menuEmitterService.menuEvent$.next(new MenuEvent(RESULT_CONCORDANCE));
          this.queryTitle = this.lastResultService.getQueryTitle();
          return;
        }
        if (this.queryRequestService.getQueryRequest().sortQueryRequest) {
          this.queryRequestService.setSortQueryRequest(
            JSON.parse(JSON.stringify(this.queryRequestService.getQueryRequest().sortQueryRequest!)));
        } else {
          this.queryRequestService.restSortQueryRequest();
        }
        this.fieldRequests = [];
        this.loading = true;
        if (res.concordances.length > 0) {
          if (res.concordances.length > 0) {
            res.concordances.forEach((c) =>
              this.fieldRequests.push(c.fieldRequest)
            );
            if (res.concordances[res.pos].sortOptions.length > 1) {
              const foundSortOption = SORT_LABELS.find(
                (sl) => sl.key === res.concordances[res.pos].sortOptions[1]
              );
              if (foundSortOption?.value) {
                res.concordances[res.pos].sortOptions[1] =
                  foundSortOption.value;
              }
            }
            this.sortOptions = res.concordances[res.pos].sortOptions;
          } else {
            this.fieldRequests = [res.concordances[0].fieldRequest];
          }
          this.sortOptions = res.concordances[res.pos].sortOptions;
          this.loadResultService.loadResults(this.fieldRequests);
          this.queryTitle = this.sortOptions.length > 1 ? this.sortOptions[0] + ' ' + this.sortOptions[1] : this.sortOptions[0]
          this.lastResultService.setQueryTitle(this.queryTitle);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.queryResponseSubscription) {
      this.queryResponseSubscription.unsubscribe();
    }
    if (this.makeConcordanceRequestSubscription) {
      this.makeConcordanceRequestSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible.currentValue === false) {
      if (this.queryResponseSubscription) {
        this.queryResponseSubscription.unsubscribe();
      }
    }
    this.queryTypeRequest =
      this.queryRequestService.getQueryRequest().queryType;
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
      queryRequest.end = CSV_PAGINATION;
      this.exportCsvService.exportCvs(queryRequest).subscribe((uuid) => {
        const endpoint = this.installationServices.getCompleteEndpoint(
          queryRequest.corpus,
          HTTP
        );
        const downloadUrl = `${endpoint}/${DOWNLOAD_CSV}/${CONCORDANCE}/${uuid}`;
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

  public isQueryWithContext(): boolean {
    return this.queryType === REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
  }

  public isQueryWithContextFromFrequencyPN(): boolean {
    return (
      this.queryType === REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST ||
      this.queryType === REQUEST_TYPE.PN_METADATA_FREQ_CONCORDANCE_QUERY_REQUEST
    );
  }

  public isTextualQuery(): boolean {
    return this.queryType === REQUEST_TYPE.TEXTUAL_QUERY_REQUEST;
  }

  public loadConcordanceForPagination(event: any): void {
    // this.queryRequestService.getQueryRequest().id = uuid();
    if (event && event.rows) {
      this.initialPagination = event.rows;
      this.queryRequestService.getQueryRequest().end =
        this.queryRequestService.getQueryRequest().start +
        this.initialPagination;
    }
    // do not change query id
    if (this.fieldRequests) {
      this.loading = true;
      this.loadResultService.loadResults(this.fieldRequests, event);
    }
  }

  public makeConcordanceFromBreadcrumbs(idx: number): void {
    this.firstTime = false;
    const descriptionsForContextQuery = this.descriptions.slice(0, idx + 1);
    this.queryRequestService.resetOptionsRequest();
    const typeSearch = ['Query'];
    // concordance Context
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (fieldRequest) {
      const ccqr = new ContextConcordanceQueryRequest();
      descriptionsForContextQuery.forEach((d) => {
        const cci = ContextConcordanceItem.getInstance();
        cci.term = d.term;
        cci.attribute = LEMMA;
        cci.tokens = d.tokens;
        cci.window = d.window;
        // TODO: usare items, cioè all, any, none
        cci.lemmaFilterType = CONTEXT_TYPE_ALL;
        ccqr.items.push(cci);
      });
      fieldRequest.contextConcordance = ccqr;
      this.queryRequestService.getQueryRequest().queryType =
        REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
      this.queryRequestService.getQueryRequest().contextConcordanceQueryRequest =
        ccqr;
      // fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequestDTO();
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload(
          [new ConcordanceRequest(fieldRequest, typeSearch)],
          0
        )
      );
    }
  }

  public makeConcordanceFromFrequencyPN(idx: number): void {
    const descriptionsForContextQuery = this.descriptions.slice(0, idx + 1);
    const descriptionClicked =
      descriptionsForContextQuery[descriptionsForContextQuery.length - 1];
    this.queryRequestService.resetOptionsRequest();
    const typeSearch = ['Query'];
    // concordance Context
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (fieldRequest) {
      const ccqr = new ContextConcordanceQueryRequest();
      descriptionsForContextQuery.forEach((d) => {
        const cci = ContextConcordanceItem.getInstance();
        cci.term = d.term;
        cci.attribute = d.attribute;
        const positionWindow = d.position.substring(1);
        const positionToken = d.position.substring(0, 1);
        let window = CONTEXT_WINDOW_LEFT;
        if (positionWindow === 'R') {
          window = CONTEXT_WINDOW_RIGHT;
        }
        cci.tokens = +positionToken;
        cci.window = window;
        // TODO: usare items, cioè all, any, none
        cci.lemmaFilterType = CONTEXT_TYPE_ALL;
        ccqr.items.push(cci);
      });
      fieldRequest.contextConcordance = ccqr;
      this.queryRequestService.getQueryRequest().queryType =
        REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
      this.queryRequestService.getQueryRequest().contextConcordanceQueryRequest =
        ccqr;
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload(
          [new ConcordanceRequest(fieldRequest, typeSearch)],
          0
        )
      );
    }
  }

  public showVideoDlg(kwicline: KWICline): void {
    if (kwicline && kwicline.startTime && kwicline.videoUrl) {
      const url = kwicline.videoUrl;
      const youtubeVideo = url.indexOf('youtube.com') >= 0;
      const startTime = +kwicline.startTime;
      if (youtubeVideo) {
        if (url?.length > 0) {
          const embedUrl = url.replace('/watch?v=', '/embed/');
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${embedUrl}?autoplay=1&start=${Math.floor(startTime)}`
          );
        }
      } else {
        if (url?.length > 0) {
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${url}?autoplay=1#t=${Math.floor(startTime)}`
          );
        }
      }

      this.displayModal = true;
    }
  }

  public showComment(kwicline: KWICline, implType: string) {
    this.implStr = implType.toUpperCase();
    this.typeStr = kwicline.references[implType + '.type'];
    this.commentStr = kwicline.references[implType + '.comment'];
    this.functionStr = kwicline.references[implType + '.function'];
  }

  public clickConc(event: any): void {
    const typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayload([], 0);
    const index = this.fieldRequests.map((fr) => fr.word).indexOf(event.word);
    this.fieldRequests = this.fieldRequests.slice(0, index + 1);
    this.fieldRequests.forEach((fr) => {
      concordanceRequestPayload.concordances.push(
        new ConcordanceRequest(fr, typeSearch)
      );
    });
    this.emitterService.makeConcordanceRequestSubject.next(
      concordanceRequestPayload
    );
  }

  public showWideContext(kwicline: KWICline): void {
    this.resultContext = null;
    const corpus = this.queryRequestService.getQueryRequest().corpus;
    if (corpus) {
      this.wideContextService
        .getWideContext(
          corpus,
          kwicline.pos,
          kwicline.kwic.trim().split(' ').length
        )
        .subscribe({
          next: (response) => {
            if (response && response.wideContextResponse) {
              const kwic = response.wideContextResponse.kwic
                ? response.wideContextResponse.kwic
                : '';
              const leftContext = response.wideContextResponse?.leftContext
                ? response.wideContextResponse.leftContext
                : '';
              const rightContext = response.wideContextResponse?.rightContext
                ? response.wideContextResponse.rightContext
                : '';
              this.resultContext = new ResultContext(
                kwic,
                leftContext,
                rightContext
              );
            }
          },
          error: (err) => {
            const wideContextError = {} as Message;
            wideContextError.severity = 'error';
            wideContextError.detail =
              'Non è stato possibile recuperare il contesto';
            wideContextError.summary = 'Errore';
            this.errorMessagesService.sendError(wideContextError);
          },
        });
    }
  }

  public showReference(kwicline: KWICline): void {
    this.resultContext = null;
    const corpus = this.queryRequestService.getQueryRequest().corpus;
    if (corpus) {
      if (this.isImpaqtsCustom) {
        this.referencePositionResponse = new ReferencePositionResponse();
        this.referencePositionResponse.tokenNumber = kwicline.pos;
        this.referencePositionResponse.documentNumber = kwicline.docNumber;
        this.referenceKeys = Object.keys(kwicline.references);
        this.referenceKeys.sort((a, b) => a.localeCompare(b));
        this.referencePositionResponse.references = kwicline.references;
      } else {
        this.referencePositionService
          .getReferenceByPosition(corpus, kwicline.pos)
          .subscribe({
            next: (response) => {
              if (response && response.referencePositionResponse) {
                this.referencePositionResponse =
                  response.referencePositionResponse;
                this.referenceKeys = Object.keys(
                  this.referencePositionResponse.references
                );
                this.referenceKeys.sort((a, b) => a.localeCompare(b));
              }
            },
            error: (err) => {
              const referencePositionError = {} as Message;
              referencePositionError.severity = 'error';
              referencePositionError.detail =
                'Non è stato possibile recuperare il riferimento associato';
              referencePositionError.summary = 'Errore';
              this.errorMessagesService.sendError(referencePositionError);
            },
          });
      }
    }
  }

  public getItemToBeDisplayed(fieldRequest: FieldRequest): string {
    switch (fieldRequest.selectedQueryType) {
      case WORD:
        return fieldRequest.word;
      case LEMMA:
        return fieldRequest.lemma;
      case PHRASE:
        return fieldRequest.phrase;
      case CHARACTER:
        return fieldRequest.character;
      case CQL:
        return fieldRequest.cql;
      default: // SIMPLE
        return fieldRequest.simple;
    }
  }

  public withContextConcordance(): boolean {
    return this.queryRequestService.withContextConcordance();
  }

  private isDifferentPagination(
    currentStart: number,
    currentEnd: number,
    qResp: QueryResponse
  ): boolean {
    if (qResp) {
      return !(currentStart === qResp.start && currentEnd === qResp.end);
    }
    return false;
  }
}
