import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FIRST, LAST, NEGATIVE, POSITIVE } from '../common/filter-constants';
import { FilterConcordanceQueryRequest } from '../model/filter-concordance-query-request';
import { Metadatum } from '../model/metadatum';
import { QueryRequestService } from '../services/query-request.service';

const FILTER_QUERY_REQUEST = 'FilterQueryRequest';

@Component({
  selector: 'app-filter-options-panel',
  templateUrl: './filter-options-panel.component.html',
  styleUrls: ['./filter-options-panel.component.scss']
})
export class FilterOptionsPanelComponent implements OnInit {

  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public filterQueryRequest: FilterConcordanceQueryRequest = FilterConcordanceQueryRequest.getInstance();

  public displayPanelMetadata = false;
  public filters: Array<string> = [];
  public selectedFilter: string | null = null;
  public tokens: Array<string> = [];
  public selectedToken: string | null = null;

  public filterQueryRequestForm = new UntypedFormGroup({
    filter: new UntypedFormControl(),
    token: new UntypedFormControl(),
    from: new UntypedFormControl(),
    to: new UntypedFormControl(),
    kwic: new UntypedFormControl()
  });;


  constructor(
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    const lsFqr = localStorage.getItem(FILTER_QUERY_REQUEST)
    this.filters = [POSITIVE, NEGATIVE];
    this.tokens = [FIRST, LAST]
    if (lsFqr) {
      const fcqr = JSON.parse(lsFqr) as FilterConcordanceQueryRequest;
      this.filterQueryRequestForm.controls.filter.setValue(fcqr.filter ? fcqr.filter : POSITIVE);
      this.filterQueryRequestForm.controls.token.setValue(fcqr.token ? fcqr.token : FIRST);
      this.filterQueryRequestForm.controls.from.setValue(fcqr.from);
      this.filterQueryRequestForm.controls.to.setValue(fcqr.to);
      this.filterQueryRequestForm.controls.kwic.setValue(fcqr.kwic);
    } else {
      this.setFqrfDefault();
    }
    this.setFilterFiledRequest();

    this.filterQueryRequestForm.valueChanges.subscribe(() => {
      this.setFilterFiledRequest();
    })
}

  public resetFilter(): void {
    localStorage.removeItem(FILTER_QUERY_REQUEST);
    this.setFqrfDefault();
    this.queryRequestService.getQueryRequest().filterConcordanceQueryRequest = null;
  }

  public clickOverlaps(): void {
    return;
  }

  public clickFirst(): void {
    return;
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  private setFilterFiledRequest(): void {
    const filterConcordanceQueryRequest = new FilterConcordanceQueryRequest(
      this.filterQueryRequestForm.controls.filter.value,
      this.filterQueryRequestForm.controls.token.value,
      this.filterQueryRequestForm.controls.from.value,
      this.filterQueryRequestForm.controls.to.value,
      this.filterQueryRequestForm.controls.kwic.value
    );
    localStorage.setItem(FILTER_QUERY_REQUEST, JSON.stringify(filterConcordanceQueryRequest));
    this.queryRequestService.setFilterConcordanceQueryRequest(filterConcordanceQueryRequest);
  }

  private setFqrfDefault(): void {
    this.filterQueryRequestForm.controls.filter.setValue( POSITIVE);
    this.filterQueryRequestForm.controls.token.setValue(FIRST);
    this.filterQueryRequestForm.controls.from.setValue(-5);
    this.filterQueryRequestForm.controls.to.setValue(5);
    this.filterQueryRequestForm.controls.kwic.setValue(false);
  }

}
