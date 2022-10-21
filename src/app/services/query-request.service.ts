import { Injectable } from '@angular/core';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { ContextConcordanceQueryRequestDTO } from '../model/context-concordance-query-request-dto';
import { FieldRequest } from '../model/field-request';
import { QueryRequest } from '../model/query-request';
import { ConcordanceRequestPayload } from '../utils/emitter.service';

@Injectable({
  providedIn: 'root'
})
export class QueryRequestService {

  public queryRequest = new QueryRequest();

  private basicFieldRequest: FieldRequest | null = null;
  // used for visual queries
  private ConcordanceRequestPayload: ConcordanceRequestPayload | null = null;
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
      this.ConcordanceRequestPayload = null;
    }
  }

  public getContextConcordanceQueryRequestDTO(): ContextConcordanceQueryRequestDTO {
    return this.contextConcordanceQueryRequestDTO;
  }

  public clearContextConcordanceQueryRequestDTO(): void {
    this.contextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();
  }

  public setConcordanceRequestPayload(ConcordanceRequestPayload: ConcordanceRequestPayload): void {
    if (ConcordanceRequestPayload) {
      this.ConcordanceRequestPayload = ConcordanceRequestPayload;
      this.basicFieldRequest = null;
    }
  }

  public getConcordanceRequestPayload(): ConcordanceRequestPayload | null {
    return this.ConcordanceRequestPayload;
  }
}
