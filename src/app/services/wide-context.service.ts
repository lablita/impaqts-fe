import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HTTP, HTTPS, WIDE_CONTEXT } from '../common/constants';
import { FIND_FAILED } from '../model/constants';
import { Installation } from '../model/installation';
import { QueryResponse } from '../model/query-response';
import { UtilService } from '../utils/util.service';


@Injectable({
  providedIn: 'root'
})
export class WideContextService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService) { }

  public getWideContext(installation: Installation, corpusName: string, pos: number, hitlen = 1): Observable<QueryResponse | null> {
    const endpoint = installation?.corpora.find(corp => corp.name === corpusName)?.endpoint;
    return this.http.get<QueryResponse>(`${endpoint}/${WIDE_CONTEXT}/${corpusName}/${pos}/${hitlen}`)
      .pipe(catchError(this.utils.handleErrorObservable('getWideContext', FIND_FAILED, null)));
  }
}
