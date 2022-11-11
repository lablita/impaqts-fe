import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CHARACTER, CQL, LEMMA, PHRASE, REQUEST_TYPE, WORD } from '../common/query-constants';
import { LEFT, MULTILEVEL, NODE, RIGHT } from '../common/sort-constants';
import { INSTALLATION, SHUFFLE } from '../model/constants';
import { ContextConcordanceItem, ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { DescResponse } from '../model/desc-response';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { ResultContext } from '../model/result-context';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { ErrorMessagesService } from '../services/error-messages.service';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { WideContextService } from '../services/wide-context.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';

const SORT_LABELS = [
  new KeyValueItem('LEFT_CONTEXT', LEFT),
  new KeyValueItem('RIGHT_CONTEXT', RIGHT),
  new KeyValueItem('NODE_CONTEXT', NODE),
  new KeyValueItem('SHUFFLE_CONTEXT', SHUFFLE),
  new KeyValueItem('MULTILEVEL_CONTEXT', MULTILEVEL)
]
@Component({
  selector: 'app-concordance-table',
  templateUrl: './concordance-table.component.html',
  styleUrls: ['./concordance-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConcordanceTableComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = [];
  @Input() public visible = false;
  @Output() public setContextFiledsFromBreadcrumbs = new EventEmitter<number>();

  public loading = false;
  public totalResults = 0;
  public firstItemTotalResults = 0;
  public kwicLines: Array<KWICline> = Array.from<KWICline>({ length: 0 });
  public noResultFound = true;
  public resultContext: ResultContext | null = null;
  public displayModal = false;
  public videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/OBmlCZTF4Xs');
  public sortOptions: string[] = [];
  public stripTags = KWICline.stripTags;

  public descriptions: Array<DescResponse> = Array.from<DescResponse>({ length: 0 });
  public fieldRequests: Array<FieldRequest> = Array.from<FieldRequest>({ length: 0 });
  public queryType = REQUEST_TYPE.TEXTUAL_QUERY_REQUEST;

  private readonly queryResponseSubscription: Subscription;
  private makeConcordanceRequestSubscription: Subscription | null = null;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    private readonly queryRequestService: QueryRequestService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly wideContextService: WideContextService
  ) {
    this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      this.queryType = this.queryRequestService.getQueryRequest().queryType;
      if (queryResponse) {
        if (queryResponse.error && queryResponse.errorResponse && queryResponse.errorResponse.errorCode === 500) {
          const errorMessage = { severity: 'error', summary: 'Errore', detail: 'Errore I/O sul server, i dati potrebbero non essere attendibili' };
          this.errorMessagesService.sendError(errorMessage);
        } else if (queryResponse.kwicLines.length > 0) {
          this.firstItemTotalResults = queryResponse.currentSize;
          let tr = queryResponse.currentSize;
          if (queryResponse.descResponses && queryResponse.descResponses.length > 0) {
            // ultimo elemento delle descResponses ha il totale visualizzato
            tr = queryResponse.descResponses[queryResponse.descResponses.length - 1].size;
          }
          this.totalResults = tr;
          this.kwicLines = queryResponse.kwicLines;
          this.noResultFound = queryResponse.currentSize < 1;
          this.descriptions = queryResponse.descResponses;
        } else {
          this.totalResults = 0;
          this.kwicLines = [];
          this.noResultFound = true;
          this.descriptions = [];
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.makeConcordanceRequestSubscription = this.emitterService.makeConcordanceRequestSubject.subscribe(res => {
      this.fieldRequests = [];
      this.loading = true;
      if (res.concordances.length > 0) {
        if (res.concordances.length > 0) {
          res.concordances.forEach(c => this.fieldRequests.push(c.fieldRequest));
          if (res.concordances[res.pos].sortOptions.length > 1) {
            const foundSortOption = SORT_LABELS.find(sl => sl.key === res.concordances[res.pos].sortOptions[1]);
            if (foundSortOption && foundSortOption.value) {
              res.concordances[res.pos].sortOptions[1] = foundSortOption.value;
            }
          }
          this.sortOptions = res.concordances[res.pos].sortOptions;
        } else {
          this.fieldRequests = [res.concordances[0].fieldRequest];
        }
        this.sortOptions = res.concordances[res.pos].sortOptions;
        this.loadResultService.loadResults(this.fieldRequests, undefined);
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
  }

  public isQueryWithContext(): boolean {
    return this.queryType === REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
  }

  public isQueryWithContextFromFrequencyPN(): boolean {
    return this.queryType === REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST;
  }

  public isTextualQuery(): boolean {
    return this.queryType === REQUEST_TYPE.TEXTUAL_QUERY_REQUEST;
  }

  public loadConcordance(event: any): void {
    if (this.fieldRequests) {
      this.loading = true;
      this.loadResultService.loadResults(this.fieldRequests, event);
    }
  }

  public makeConcordanceFromBreadcrumbs(idx: number): void {
    const descriptionsForContextQuery = this.descriptions.slice(0, idx + 1);
    this.queryRequestService.resetOptionsRequest();
    const typeSearch = ['Query'];
    // concordance Context
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (fieldRequest) {
      const ccqr = new ContextConcordanceQueryRequest();
      descriptionsForContextQuery.forEach(d => {
        const cci = ContextConcordanceItem.getInstance();
        cci.term = d.term;
        cci.attribute = LEMMA;
        cci.tokens = d.tokens;
        cci.window = d.window;
        // TODO: usare items, cioè all, any, none
        cci.item = 'all';
        ccqr.items.push(cci);
      });
      fieldRequest.contextConcordance = ccqr;
      this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
      this.queryRequestService.getQueryRequest().contextConcordanceQueryRequest = ccqr;
      // fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequestDTO();
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload([new ConcordanceRequest(fieldRequest, typeSearch)], 0));
    }
  }

  public makeConcordanceFromFrequencyPN(idx: number): void {
    const descriptionsForContextQuery = this.descriptions.slice(0, idx + 1);
    const descriptionClicked = descriptionsForContextQuery[descriptionsForContextQuery.length - 1];
    this.queryRequestService.resetOptionsRequest();
    const typeSearch = ['Query'];
    // concordance Context
    const fieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (fieldRequest) {
      const ccqr = new ContextConcordanceQueryRequest();
      descriptionsForContextQuery.forEach(d => {
        const cci = ContextConcordanceItem.getInstance();
        cci.term = d.term;
        cci.attribute = d.attribute;
        const positionWindow = d.position.substring(1);
        const positionToken = d.position.substring(0, 1);
        let window = 'LEFT';
        if (positionWindow === 'R') {
          window = 'RIGHT';
        }
        cci.tokens = +positionToken;
        cci.window = window;
        // TODO: usare items, cioè all, any, none
        cci.item = 'all';
        ccqr.items.push(cci);
      });
      fieldRequest.contextConcordance = ccqr;
      this.queryRequestService.getQueryRequest().queryType = REQUEST_TYPE.CONTEXT_QUERY_REQUEST;
      this.queryRequestService.getQueryRequest().contextConcordanceQueryRequest = ccqr;
      // fieldRequest.contextConcordance = this.queryRequestService.getContextConcordanceQueryRequestDTO();
      this.emitterService.makeConcordanceRequestSubject.next(
        new ConcordanceRequestPayload([new ConcordanceRequest(fieldRequest, typeSearch)], 0));
    }
  }

  public showVideoDlg(rowIndex: number): void {
    const youtubeVideo = rowIndex % 2 > 0;
    let url = '';

    if (youtubeVideo) {
      url = 'https://www.youtube.com/embed/OBmlCZTF4Xs';
      const start = Math.floor((Math.random() * 200) + 1);
      const end = start + Math.floor((Math.random() * 20) + 1);
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${url}?autoplay=1&start=${start}&end=${end}`
        );
      }
    } else {
      url = 'https://player.vimeo.com/video/637089218';
      const start = `${Math.floor((Math.random() * 5) + 1)}m${Math.floor((Math.random() * 60) + 1)}s`;
      if (url?.length > 0) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${url}?autoplay=1#t=${start}`);
      }
    }

    this.displayModal = true;
  }

  public clickConc(event: any): void {
    let typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayload([], 0);
    const index = this.fieldRequests.map(fr => fr.word).indexOf(event.word);
    this.fieldRequests = this.fieldRequests.slice(0, index + 1);
    this.fieldRequests.forEach(fr => {
      concordanceRequestPayload.concordances.push(new ConcordanceRequest(fr, typeSearch));
    });
    this.emitterService.makeConcordanceRequestSubject.next(concordanceRequestPayload);
  }

  public showWideContext(kwicline: KWICline): void {
    this.resultContext = null;
    const corpus = this.queryRequestService.getBasicFieldRequest()?.selectedCorpus?.value;
    const localInst = localStorage.getItem(INSTALLATION);
    if (localInst && corpus) {
      const inst = JSON.parse(localInst);
      this.wideContextService.getWideContext(inst, corpus, kwicline.pos).subscribe({
        next: response => {
          if (response && response.wideContextResponse) {
            const kwic = response.wideContextResponse.kwic ? response.wideContextResponse.kwic : '';
            const leftContext = response.wideContextResponse?.leftContext ? response.wideContextResponse.leftContext : '';
            const rightContext = response.wideContextResponse?.rightContext ? response.wideContextResponse.rightContext : '';
            this.resultContext = new ResultContext(kwic, leftContext, rightContext);
          }
        },
        error: err => {
          const wideContextError = {} as Message;
          wideContextError.severity = 'error';
          wideContextError.detail = 'Non è stato possibile recuperare il contesto';
          wideContextError.summary = 'Errore';
          this.errorMessagesService.sendError(wideContextError);
        }
      });
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
}
