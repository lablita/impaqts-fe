import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CHARACTER, CQL, LEMMA, PHRASE, WORD } from '../common/query-constants';
import { LEFT, MULTILEVEL, NODE, RIGHT } from '../common/sort-constants';
import { SHUFFLE } from '../model/constants';
import { DescResponse } from '../model/desc-response';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { ResultContext } from '../model/result-context';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { ConcordanceRequestPayLoad, EmitterService } from '../utils/emitter.service';

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
  styleUrls: ['./concordance-table.component.scss']
})
export class ConcordanceTableComponent implements OnInit, AfterViewInit {

  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });;
  @Input() public visible = false;
  @Output() public clearContextFields = new EventEmitter<boolean>();

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
  public queryWithContext = false;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    public queryRequestService: QueryRequestService
  ) {
    this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse && queryResponse.kwicLines.length > 0) {
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
        this.queryWithContext = queryResponse.descResponses && queryResponse.descResponses.length > 0;
      } else {
        this.totalResults = 0;
        this.kwicLines = [];
        this.noResultFound = true;
        this.descriptions = [];
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.emitterService.makeConcordance.subscribe(res => {
      this.fieldRequests = [];
      this.loading = true;
      //this.fieldRequests.push(this.fieldRequest);
      res.concordances.forEach(c => this.fieldRequests.push(c.fieldRequest));
      //this.fieldRequest = res.concordances[res.pos].fieldRequest;
      if (res.concordances[res.pos].sortOptions.length > 1) {
        res.concordances[res.pos].sortOptions[1] = SORT_LABELS.find(sl => sl.key === res.concordances[res.pos].sortOptions[1])?.value!;
      }
      this.sortOptions = res.concordances[res.pos].sortOptions;
      this.loadResultService.loadResults(this.fieldRequests);
    });
  }

  public loadConcordance(event: any): void {
    if (this.fieldRequests) {
      this.loading = true;
      this.loadResultService.loadResults(this.fieldRequests, event);
    }
  }

  public makeConcordanceNoContext(): void {
    // remove context from fieldRequest
    this.fieldRequests[this.fieldRequests.length - 1].contextConcordance = null;
    this.clearContextFields.next(true);
    this.emitterService.makeConcordance.next(new ConcordanceRequestPayLoad([new ConcordanceRequest(this.fieldRequests[this.fieldRequests.length - 1], this.sortOptions)], 0));
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
    const concordanceRequestPayload = new ConcordanceRequestPayLoad([], 0);
    const index = this.fieldRequests.map(fr => fr.word).indexOf(event.word);
    this.fieldRequests = this.fieldRequests.slice(0, index + 1);
    this.fieldRequests.forEach(fr => {
      concordanceRequestPayload.concordances.push(new ConcordanceRequest(fr, typeSearch));
    });
    this.emitterService.makeConcordance.next(concordanceRequestPayload);
  }

  public showDialog(kwicline: KWICline): void {
    // kwicline.ref to retrive info
    this.resultContext = new ResultContext(kwicline.kwic,
      KWICline.stripTags(kwicline.leftContext, this.queryRequestService.withContextConcordance()),
      KWICline.stripTags(kwicline.rightContext, this.queryRequestService.withContextConcordance()));
  }

  public getItemToBeDisplayed(fieldRequest: FieldRequest): string {
    switch (fieldRequest.selectedQueryType?.key) {
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
}
