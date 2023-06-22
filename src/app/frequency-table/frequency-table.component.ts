import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HTTP, HTTPS } from '../common/constants';
import { FREQ, REL } from '../common/frequency-constants';
import { REQUEST_TYPE} from '../common/query-constants';
import { DOWNLOAD_CSV } from '../common/routes-constants';
import { ASC, DESC, INSTALLATION } from '../model/constants';
import { FieldRequest } from '../model/field-request';
import { FrequencyItem } from '../model/frequency-item';
import { FrequencyOption } from '../model/frequency-query-request';
import { FrequencyResultLine } from '../model/frequency-result-line';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { ConcordanceRequest } from '../queries-container/queries-container.component';
import { ErrorMessagesService } from '../services/error-messages.service';
import { ExportCsvService } from '../services/export-csv.service';
import { LoadResultsService } from '../services/load-results.service';
import { QueryRequestService } from '../services/query-request.service';
import { ConcordanceRequestPayload, EmitterService } from '../utils/emitter.service';
import { QueryRequest } from '../model/query-request';
import * as _ from  'lodash';
import { Subscription } from 'rxjs';

const PAGE_FREQUENCY_FREQUENCY = 'PAGE.FREQUENCY.FREQUENCY';
const METADATA_FREQUENCY = 'metadata_frequency'
const MULTILEVEL_FREQUENCY = 'multilevel_frequency'

const COL_HEADER_TEXTTYPE = [
  'PAGE.FREQUENCY.FREQUENCY',
  'PAGE.FREQUENCY.REL',
];
@Component({
  selector: 'app-frequency-table',
  templateUrl: './frequency-table.component.html',
  styleUrls: ['./frequency-table.component.scss']
})
export class FrequencyTableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() public visible = false;
  @Input() public category = '';
  @Input() public first = false;
  @Input() public corpus: KeyValueItem | null = null;
  @Output() public titleResult = new EventEmitter<string>();

  public paginations: number[] = [10, 25, 50];
  public loading = false;
  public fieldRequest: FieldRequest | null = null;
  public totalResults = 0;
  public totalFrequency = 0;
  public totalItems = 0;
  public maxFreq = 0;
  public maxRel = 0;
  public noResultFound = true;
  public frequency: FrequencyItem = new FrequencyItem();
  public lines: Array<FrequencyResultLine> = [];
  public colHeaders: Array<string> = [];
  public sortField = '';
  public multilevel = false;
  public operation = '';

  private readonly queryResponseSubscription: Subscription;
  private makeFrequencySubscription: Subscription | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService,
    public readonly queryRequestService: QueryRequestService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly exportCsvService: ExportCsvService,
  //  private readonly httpClient: HttpClient
  ) {
    this.queryResponseSubscription = this.loadResultService.getQueryResponse$().subscribe(queryResponse => {
      this.loading = false;
      if (queryResponse) {
        const queryRequest = this.queryRequestService.getQueryRequest();
        if (queryResponse.error && queryResponse.errorResponse && queryResponse.errorResponse.errorCode === 500) {
          const errorMessage = { severity: 'error', summary: 'Errore', detail: 'Errore I/O sul server, i dati potrebbero non essere attendibili' };
          this.errorMessagesService.sendError(errorMessage);
        } else if (queryResponse.frequency && ((
          queryRequest
          && queryRequest.frequencyQueryRequest
          && queryRequest.frequencyQueryRequest.categories
          && queryRequest.frequencyQueryRequest.categories.length > 0)
          ? this.category === queryResponse.frequency.head : true)) {
          this.totalResults = queryResponse.currentSize;
          this.frequency = queryResponse.frequency;
          this.lines = this.frequency.items;
          this.totalItems = this.frequency.total;
          this.totalFrequency = this.frequency.totalFreq;
          this.maxFreq = this.frequency.maxFreq;
          this.maxRel = this.frequency.maxRel;
          this.operation = this.frequency.operation;
          this.noResultFound = this.totalItems < 1;
          this.setColumnHeaders();
        }
      }
    });
  }


  ngOnInit(): void {
    this.setColumnHeaders();
  }

  ngAfterViewInit(): void {
    if (!this.makeFrequencySubscription) {
       this.makeFrequencySubscription = this.emitterService.makeFrequency.pipe(first()).subscribe(fieldRequest => {
        // this is to remove double spinner. First call is due to empty FieldRequest in behaviour subject initialization
        if (fieldRequest && fieldRequest.selectedCorpus) {
          this.loading = true;
          this.fieldRequest = fieldRequest;
          const queryRequest = this.queryRequestService.getQueryRequest();
          if (queryRequest && queryRequest.frequencyQueryRequest) {
            queryRequest.frequencyQueryRequest.category = this.category;
            this.loadResultService.loadResults([fieldRequest]);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.queryResponseSubscription) {
      this.queryResponseSubscription.unsubscribe();
    }
    if (this.makeFrequencySubscription) {
      this.makeFrequencySubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && changes.visible.currentValue === false) {
      if (this.queryResponseSubscription) {
        this.queryResponseSubscription.unsubscribe();
      }
      if (this.makeFrequencySubscription) {
        this.makeFrequencySubscription.unsubscribe();
      }
    }
  }

  public downloadCsv(category: string): void {
      const queryRequest: QueryRequest = _.cloneDeep(this.queryRequestService.getQueryRequest());
      if (queryRequest && queryRequest.frequencyQueryRequest) {
        queryRequest.frequencyQueryRequest.category = category;
        queryRequest.end = 100000000;
        this.exportCsvService.exportCvs(queryRequest).subscribe((uuid) => {
          const inst = localStorage.getItem(INSTALLATION);
          if (inst) {
            const installation = JSON.parse(inst) as Installation;
            const endpoint = installation?.corpora.find(corp => corp.name === queryRequest.corpus)?.endpoint;
            const url = (environment.secureUrl ? HTTPS : HTTP) + endpoint;
            const filename = queryRequest.queryType === REQUEST_TYPE.MULTI_FREQUENCY_QUERY_REQUEST ? MULTILEVEL_FREQUENCY : `${METADATA_FREQUENCY}_${category}`;
            const downloadUrl = `${url}/${DOWNLOAD_CSV}/${filename}/${uuid}`;
            this.exportCsvService.download(downloadUrl).then();
          }
       });
      }
  }

  // private async download(downloadUrl: string): Promise<void> {
  //    // Download the document as a blob
  //    const response = await this.httpClient.get(
  //     downloadUrl,
  //     { responseType: 'blob', observe: 'response' }
  //   ).toPromise();

  //   // Create a URL for the blob
  //   const url = URL.createObjectURL(response.body!);

  //   // Create an anchor element to "point" to it
  //   const anchor = document.createElement('a');
  //   anchor.href = url;

  //   // Get the suggested filename for the file from the response headers
  //   anchor.download = this.getFilenameFromHeaders(response.headers) || 'file';

  //   // Simulate a click on our anchor element
  //   anchor.click();

  //   // Discard the object data
  //   URL.revokeObjectURL(url);
  // }

  // private getFilenameFromHeaders(headers: HttpHeaders) {
  //   // The content-disposition header should include a suggested filename for the file
  //   const contentDisposition = headers.get('Content-Disposition');
  //   if (!contentDisposition) {
  //     return null;
  //   }

  //   /* StackOverflow is full of RegEx-es for parsing the content-disposition header,
  //   * but that's overkill for my purposes, since I have a known back-end with
  //   * predictable behaviour. I can afford to assume that the content-disposition
  //   * header looks like the example in the docs
  //   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
  //   *
  //   * In other words, it'll be something like this:
  //   *    Content-Disposition: attachment; filename="filename.ext"
  //   *
  //   * I probably should allow for single and double quotes (or no quotes) around
  //   * the filename. I don't need to worry about character-encoding since all of
  //   * the filenames I generate on the server side should be vanilla ASCII.
  //   */

  //   const leadIn = 'filename=';
  //   const start = contentDisposition.search(leadIn);
  //   if (start < 0) {
  //     return null;
  //   }

  //   // Get the 'value' after the filename= part (which may be enclosed in quotes)
  //   const value = contentDisposition.substring(start + leadIn.length).trim();
  //   if (value.length === 0) {
  //     return null;
  //   }

  //   // If it's not quoted, we can return the whole thing
  //   const firstCharacter = value[0];
  //   if (firstCharacter !== '\"' && firstCharacter !== '\'') {
  //     return value;
  //   }

  //   // If it's quoted, it must have a matching end-quote
  //   if (value.length < 2) {
  //     return null;
  //   }

  //   // The end-quote must match the opening quote
  //   const lastCharacter = value[value.length - 1];
  //   if (lastCharacter !== firstCharacter) {
  //     return null;
  //   }

  //   // Return the content of the quotes
  //   return value.substring(1, value.length - 1);
  // }

  public loadFrequencies(event: any): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    if (this.fieldRequest && queryRequest.frequencyQueryRequest) {
      this.loading = true;
      if (event.sortField === '' || event.sortField.indexOf(PAGE_FREQUENCY_FREQUENCY) >= 0) {
        queryRequest.frequencyQueryRequest.frequencyType = FREQ;
      } else if (event.sortField.indexOf('PAGE.FREQUENCY.REL') >= 0) {
        queryRequest.frequencyQueryRequest.frequencyType = REL;
      } else if (event.sortField) {
        queryRequest.frequencyQueryRequest.frequencyType = null;
        queryRequest.frequencyQueryRequest.frequencyColSort =
          (event.sortField as string).substring((event.sortField as string).lastIndexOf('-') + 1);
      }
      queryRequest.frequencyQueryRequest.frequencyTypeSort = event.sortOrder === -1 ? DESC : ASC;
      this.loadResultService.loadResults([this.fieldRequest], event);
    }
  }

  public clickPN(event: any, positive: boolean): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    const typeSearch = ['Query'];
    const concordanceRequestPayload = new ConcordanceRequestPayload(
      !!this.fieldRequest ? [new ConcordanceRequest(this.fieldRequest, typeSearch)] : [], 0);
    if (queryRequest.frequencyQueryRequest) {
      queryRequest.frequencyQueryRequest.positive = positive;
    }
    if (this.operation === REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST) {
      const freqOptList = queryRequest.frequencyQueryRequest?.freqOptList;
      if (!!freqOptList && freqOptList.length === event.word.length) {
        for (let i = 0; i < event.word.length; i++) {
          freqOptList[i].term = event.word[i];
        }
      }
      queryRequest.queryType = REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST;
    } else {
      const freqOpt = new FrequencyOption();
      freqOpt.term = event.word[0];
      queryRequest.frequencyQueryRequest?.freqOptList.push(freqOpt);
      queryRequest.queryType = REQUEST_TYPE.PN_METADATA_FREQ_CONCORDANCE_QUERY_REQUEST;
    }
    this.emitterService.makeConcordanceRequestSubject.next(concordanceRequestPayload);
    this.titleResult.emit('MENU.CONCORDANCE');
  }

  private setColumnHeaders(): void {
    const frequencyQueryRequest = this.queryRequestService.getQueryRequest().frequencyQueryRequest;
    if (frequencyQueryRequest) {
      this.multilevel = frequencyQueryRequest.freqOptList.length > 0;
      const multilevelColHeaders = frequencyQueryRequest.freqOptList.map(freqOpt => freqOpt.attribute ? freqOpt.attribute : '');
      multilevelColHeaders.push(PAGE_FREQUENCY_FREQUENCY);
      this.colHeaders = this.multilevel ? multilevelColHeaders : COL_HEADER_TEXTTYPE;
      this.sortField = `${PAGE_FREQUENCY_FREQUENCY}-${(this.colHeaders.length - 1)}`;
    }
  }

}
