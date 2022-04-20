import { Injectable } from '@angular/core';
import { QueryRequest } from '../model/query-request';

@Injectable({
  providedIn: 'root'
})
export class QueryRequestService {

  public queryRequest = new QueryRequest();

  constructor() { }

  public resetOptionsRequest(): void {
    this.queryRequest.collocationQueryRequest = null;
    this.queryRequest.sortQueryRequest = null;
  }

  public isOptionSet(): boolean {
    return !!this.queryRequest.collocationQueryRequest || !!this.queryRequest.sortQueryRequest;
  }
}
