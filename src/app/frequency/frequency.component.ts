import { Component, OnInit } from '@angular/core';
import { FieldRequest } from '../model/field-request';
import { LoadResultsService } from '../services/load-results.service';
import { EmitterService } from '../utils/emitter.service';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss']
})
export class FrequencyComponent implements OnInit {
  public loading = false;
  public fieldRequest: FieldRequest | null = null;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly loadResultService: LoadResultsService
  ) {
    this.loadResultService.getWebSocketResponse().subscribe(socketResponse => {
      this.loading = false;
      if (socketResponse) {
        // this.totalResults = socketResponse.totalResults;
        // this.collocations = socketResponse.collocations;
        // this.noResultFound = socketResponse.noResultFound;
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




}
