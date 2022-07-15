import { Component, Input, OnInit } from '@angular/core';
import { FieldRequest } from '../model/field-request';
import { FrequencyItem } from '../model/frequency-item';
import { FrequencyResultLine } from '../model/frequency-result-line';
import { LoadResultsService } from '../services/load-results.service';
import { EmitterService } from '../utils/emitter.service';

const COL_HEADER = [
  'PAGE.FREQUENCY.WORD',
  'PAGE.FREQUENCY.LEMMA',
  'PAGE.FREQUENCY.TAG',
  'PAGE.FREQUENCY.WORD',
  'PAGE.FREQUENCY.FREQUENCY',
  'PAGE.FREQUENCY.ITEMS'
];
@Component({
  selector: 'app-frequency-table',
  templateUrl: './frequency-table.component.html',
  styleUrls: ['./frequency-table.component.scss']
})
export class FrequencyTableComponent implements OnInit {
  @Input() public initialPagination = 10;
  @Input() public paginations: Array<number> = Array.from<number>({ length: 0 });
  @Input() public visible = false;

  public loading = false;
  public fieldRequest: FieldRequest | null = null;
  public totalResults = 0;
  public noResultFound = true;
  public frequencies: Array<FrequencyItem> = Array.from<FrequencyItem>({ length: 0 });
  public lines: Array<FrequencyResultLine> = Array.from<FrequencyResultLine>({ length: 0 });
  public colHeader: Array<string> = COL_HEADER;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService
  ) {
    this.loadResultService.getWebSocketResponse().subscribe(socketResponse => {
      this.loading = false;
      if (socketResponse && socketResponse.frequencies.length > 0 && socketResponse.frequencies[0].items.length > 0) {
        this.totalResults = socketResponse.totalResults;
        this.frequencies = socketResponse.frequencies;
        this.lines = this.frequencies[0].items;
        this.noResultFound = socketResponse.noResultFound;
      }
    });
    this.emitterService.makeFrequency.subscribe(fieldRequest => {
      this.loading = true;
      this.fieldRequest = fieldRequest;
      this.loadResultService.loadResults(fieldRequest);
    });
  }

  ngOnInit(): void {
  }

  public loadFrequencies(event: any): void {
    if (this.fieldRequest) {
      this.loading = true;
      // const collocationSortingParams = this.loadResultService.getCollocationSortingParams(this.fieldRequest, event);
      // this.colHeader = collocationSortingParams.colHeader;
      // this.sortField = collocationSortingParams.headerSortBy;
      this.loadResultService.loadResults(this.fieldRequest, event);
    }
  }

}
