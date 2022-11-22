import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CORPUS_INFO, HTTP, HTTPS } from '../common/constants';
import { FIND_FAILED } from '../model/constants';
import { CorpusInfo } from '../model/corpusinfo/corpus-info';
import { Installation } from '../model/installation';
import { QueryResponse } from '../model/query-response';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class CorpusInfoService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService) { }

  public getCorpusInfo(installation: Installation, corpusName: string): Observable<CorpusInfo | null> {
    const endpoint = installation?.corpora.find(corp => corp.name === corpusName)?.endpoint;
    const url = (environment.secureUrl ? HTTPS : HTTP) + endpoint;
    return this.http.get<QueryResponse>(`${url}/${CORPUS_INFO}/${corpusName}`)
      .pipe(
        map(qr => qr.corpusInfo),
        catchError(this.utils.handleErrorObservable('getWideContext', FIND_FAILED, null)
        ));
  }
}
