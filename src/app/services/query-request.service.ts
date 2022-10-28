import { Injectable } from '@angular/core';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { ContextConcordanceQueryRequestDTO } from '../model/context-concordance-query-request-dto';
import { FieldRequest } from '../model/field-request';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';

@Injectable({
  providedIn: 'root'
})
export class QueryRequestService {

  private queryRequest: QueryRequest = new QueryRequest();

  private basicFieldRequest: FieldRequest | null = null;
  // used for visual queries
  private queryPattern: QueryPattern | null = null;


  private contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();
  public resetOptionsRequest(): void {
    this.queryRequest.collocationQueryRequest = null;
    this.queryRequest.sortQueryRequest = null;
    this.queryRequest.frequencyQueryRequest = null;
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
      this.queryPattern = null;
    }
  }

  public getContextConcordanceQueryRequestDTO(): ContextConcordanceQueryRequestDTO {
    return this.contextConcordanceQueryRequestDTO;
  }

  public clearContextConcordanceQueryRequestDTO(): void {
    this.contextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();
  }

  public setQueryPattern(queryPattern: QueryPattern): void {
    if (queryPattern) {
      this.queryPattern = queryPattern;
      this.basicFieldRequest = null;
    }
  }

  public getQueryPattern(): QueryPattern | null {
    return this.queryPattern;
  }

  public getQueryRequest(): QueryRequest {
    return this.queryRequest;
  }
}
