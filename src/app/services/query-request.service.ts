import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { FREQ_OPTIONS_QUERY_REQUEST, VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import { REQUEST_TYPE } from '../common/query-constants';
import { ContextConcordanceItem, ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { FieldRequest } from '../model/field-request';
import { FilterConcordanceQueryRequest } from '../model/filter-concordance-query-request';
import { KeyValueItem } from '../model/key-value-item';
import { PanelLabelStatus } from '../model/panel-label-status';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryStructure } from '../model/query-structure';
import { SortQueryRequest } from '../model/sort-query-request';
import { DisplayPanelService } from './display-panel.service';

@Injectable({
  providedIn: 'root'
})
export class QueryRequestService {

  private queryRequest: QueryRequest = new QueryRequest();

  private basicFieldRequest: FieldRequest | null = null;

  private sortQueryRequest: SortQueryRequest | null = null;

  private contextConcordanceQueryRequest: ContextConcordanceQueryRequest = new ContextConcordanceQueryRequest();

  private titleLabelKeyValue = '';

  private viewOptionIsChanged = false;

  constructor(
    private readonly displayPanelService: DisplayPanelService
  ) {
    this.displayPanelService.panelLabelStatusSubject.subscribe((panelLabelStatus: PanelLabelStatus) => {
      this.titleLabelKeyValue = panelLabelStatus.titleLabelKeyValue.key;
    });
  }

  public setSortQueryRequest(sortQueryRequest: SortQueryRequest): void {
    this.sortQueryRequest = sortQueryRequest;
  }

  public getSortQueryRequest(): SortQueryRequest | null {
    return this.sortQueryRequest;
  }

  public restSortQueryRequest(): void {
    this.sortQueryRequest = null;
  }

  public resetOptionsRequest(): void {
    this.queryRequest.collocationQueryRequest = null;
    this.queryRequest.sortQueryRequest = null;
    this.queryRequest.frequencyQueryRequest = null;
  }

  public resetFrequencyOptRequest(): void {
    this.queryRequest.frequencyQueryRequest = null;
    localStorage.removeItem(FREQ_OPTIONS_QUERY_REQUEST);
  }

  public resetQueryPattern(): void {
    this.queryRequest.queryPattern = new QueryPattern();
  }

  public setViewOptionHasChanged(viewOptionIsChanged: boolean): void {
    this.viewOptionIsChanged = viewOptionIsChanged;
  }

  public elaborationViewOptionHasChanged(viewOptionSelected: Array<KeyValueItem>): void {
    const viewOptionStored = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
    const res = JSON.stringify(viewOptionSelected) !== viewOptionStored;
    this.viewOptionIsChanged = res;
  }

  public getViewOptionIsChanged(): boolean {
    return this.viewOptionIsChanged;
  }

  public isOptionSet(): boolean {
    return !!this.queryRequest.collocationQueryRequest || !!this.queryRequest.sortQueryRequest ||
      !!this.queryRequest.frequencyQueryRequest || !!this.queryRequest.filterConcordanceQueryRequest
      || (!!this.sortQueryRequest && this.titleLabelKeyValue === 'sort');
  }

  public resetContextConcordance(): void {
    this.queryRequest.contextConcordanceQueryRequest = null;
  }

  public withContextConcordance(): boolean {
    return this.queryRequest.queryType === REQUEST_TYPE.CONTEXT_QUERY_REQUEST || this.queryRequest.queryType === REQUEST_TYPE.PN_MULTI_FREQ_CONCORDANCE_QUERY_REQUEST;
  }

  public setContextConcordance(contextConcordanceQueryRequest: ContextConcordanceQueryRequest): void {
    this.queryRequest.contextConcordanceQueryRequest = contextConcordanceQueryRequest;
  }

  public getBasicFieldRequest(): FieldRequest | null {
    return this.basicFieldRequest;
  }

  public setBasicFieldRequest(fieldRequest: FieldRequest): void {
    if (fieldRequest) {
      this.basicFieldRequest = fieldRequest;
    }
  }

  public setFilterConcordanceQueryRequest(filterConcordanceQueryRequest: FilterConcordanceQueryRequest): void {
    if (filterConcordanceQueryRequest) {
      this.queryRequest.filterConcordanceQueryRequest = filterConcordanceQueryRequest;
    }
  }

  public getContextConcordanceQueryRequest(): ContextConcordanceQueryRequest {
    return this.contextConcordanceQueryRequest;
  }

  public clearContextConcordanceQueryRequest(): void {
    this.contextConcordanceQueryRequest.items.splice(0, this.contextConcordanceQueryRequest.items.length);
    const cci = ContextConcordanceItem.getInstance();
    this.contextConcordanceQueryRequest.items.push(cci);
  }

  public setQueryPattern(queryPattern: QueryPattern): void {
    if (queryPattern) {
      this.queryRequest.queryPattern = queryPattern;
      this.basicFieldRequest = null;
    }
  }

  public getQueryPattern(): QueryPattern | null {
    return this.queryRequest.queryPattern;
  }

  public getQueryRequest(): QueryRequest {
    return this.queryRequest;
  }

  public replaceEmptyStringWithWildcard(queryPattern: QueryPattern): QueryPattern {
    const queryPatternToSend: QueryPattern = _.cloneDeep(queryPattern);
    if (
      queryPatternToSend.tokPattern &&
      queryPatternToSend.tokPattern.length > 0
    ) {
      queryPatternToSend.tokPattern.forEach((tag) => {
        if (tag.tags && tag.tags.length > 0) {
          tag.tags.forEach((aqt) => {
            if (aqt && aqt.length > 0) {
              aqt.forEach((qt) => {
                if (!qt.value || qt.value.trim() === '') {
                  qt.value = '.*';
                }
              });
            }
          });
        }
      });
    }
    queryPatternToSend.structPattern = this.cleanStructPattern(queryPatternToSend.structPattern);
    return queryPatternToSend;
  }

  private cleanStructPattern(structPattern: QueryStructure): QueryStructure {
    if (structPattern && structPattern.tags && structPattern.tags.length > 0) {
      structPattern.tags = structPattern.tags.map(tags => tags.filter(tag => tag.value.length > 0));
    }
    structPattern.tags = structPattern.tags.filter(tags => tags.length > 0);
    return structPattern;
  }

}
