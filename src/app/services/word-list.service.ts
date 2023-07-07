import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilService } from '../utils/util.service';
import { InstallationService } from './installation.service';
import { Observable } from 'rxjs';
import { QueryResponse } from '../model/query-response';
import { HTTP } from '../common/constants';
import { WORD_LIST } from '../common/routes-constants';
import { catchError, map } from 'rxjs/operators';
import { WordListResponse } from '../model/word-list-response';
import { QueryRequest } from '../model/query-request';
import { FIND_FAILED } from '../model/constants';


@Injectable({
  providedIn: 'root'
})
export class WordListService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
    private readonly installationServices: InstallationService
    ) { }

  public getWordList(queryRequest: QueryRequest): Observable<WordListResponse | null> {
    const endpoint = this.installationServices.getCompleteEndpoint(queryRequest.corpus, HTTP);
    return this.http.post<QueryResponse>(`${endpoint}/${WORD_LIST}`, queryRequest)
      .pipe(
        map(qr => qr.wordList),
        catchError(this.utils.handleErrorObservable('getWordList', FIND_FAILED, null)
        ));
  }
}