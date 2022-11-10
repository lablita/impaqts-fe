import { Injectable } from '@angular/core';
import { ContextConcordanceItem, ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { FieldRequest } from '../model/field-request';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';

@Injectable({
  providedIn: 'root'
})
export class QueryRequestService {

  private queryRequest: QueryRequest = new QueryRequest();

  private basicFieldRequest: FieldRequest | null = null;


  private contextConcordanceQueryRequest: ContextConcordanceQueryRequest = new ContextConcordanceQueryRequest();

  public resetOptionsRequest(): void {
    this.queryRequest.collocationQueryRequest = null;
    this.queryRequest.sortQueryRequest = null;
    this.queryRequest.frequencyQueryRequest = null;
  }

  public resetQueryPattern(): void {
    this.queryRequest.queryPattern = new QueryPattern();
  }

  public isOptionSet(): boolean {
    return !!this.queryRequest.collocationQueryRequest || !!this.queryRequest.sortQueryRequest || !!this.queryRequest.frequencyQueryRequest;
  }

  public resetContextConcordance(): void {
    this.queryRequest.contextConcordanceQueryRequest = null;
  }

  public withContextConcordance(): boolean {
    return !!this.queryRequest ? !!this.queryRequest.contextConcordanceQueryRequest : false;
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
}
