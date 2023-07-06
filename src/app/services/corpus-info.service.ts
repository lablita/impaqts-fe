import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CORPUS_INFO, HTTP } from '../common/constants';
import { FIND_FAILED } from '../model/constants';
import { CorpusInfo } from '../model/corpusinfo/corpus-info';
import { QueryResponse } from '../model/query-response';
import { UtilService } from '../utils/util.service';
import { InstallationService } from './installation.service';

@Injectable({
  providedIn: 'root'
})
export class CorpusInfoService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
    private readonly installationServices: InstallationService
    ) { }

  public getCorpusInfo(corpusName: string): Observable<CorpusInfo | null> {
    const endpoint = this.installationServices.getCompleteEndpoint(corpusName, HTTP);
    return this.http.get<QueryResponse>(`${endpoint}/${CORPUS_INFO}/${corpusName}`)
      .pipe(
        map(qr => qr.corpusInfo),
        catchError(this.utils.handleErrorObservable('getWideContext', FIND_FAILED, null)
        ));
  }
}
