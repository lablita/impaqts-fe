import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilService } from '../utils/util.service';
import { InstallationService } from './installation.service';
import { Observable } from 'rxjs';
import { QueryResponse } from '../model/query-response';
import { HTTP, REFERENCE_POSITION } from '../common/constants';
import { catchError } from 'rxjs/operators';
import { FIND_FAILED } from '../model/constants';

@Injectable({
  providedIn: 'root'
})
export class ReferencePositionService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
    private readonly installationServices: InstallationService
    ) { }

  public getReferenceByPosition(corpusName: string, pos: number): Observable<QueryResponse | null> {
    const endpoint = this.installationServices.getCompleteEndpoint(corpusName, HTTP);
    return this.http.get<QueryResponse>(`${endpoint}/${REFERENCE_POSITION}/${corpusName}/${pos}`)
      .pipe(catchError(this.utils.handleErrorObservable('getReferenceByPosition', FIND_FAILED, null)));
  }
}
