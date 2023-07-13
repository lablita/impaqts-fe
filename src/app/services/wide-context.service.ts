import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP, WIDE_CONTEXT } from '../common/constants';
import { FIND_FAILED } from '../model/constants';
import { QueryResponse } from '../model/query-response';
import { UtilService } from '../utils/util.service';
import { InstallationService } from './installation.service';


@Injectable({
  providedIn: 'root'
})
export class WideContextService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
    private readonly installationServices: InstallationService
    ) { }

  public getWideContext(corpusName: string, pos: number, hitlen = 1): Observable<QueryResponse | null> {
    const endpoint = this.installationServices.getCompleteEndpoint(corpusName, HTTP);
    return this.http.get<QueryResponse>(`${endpoint}/${WIDE_CONTEXT}/${corpusName}/${pos}/${hitlen}`)
      .pipe(catchError(this.utils.handleErrorObservable('getWideContext', FIND_FAILED, null)));
  }
}
