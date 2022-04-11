import { Injectable } from '@angular/core';
import { QueryRequest } from '../model/query-request';

@Injectable({
  providedIn: 'root'
})
export class QueryRequestService {

  public queryRequest = new QueryRequest();

  constructor() { }
}
