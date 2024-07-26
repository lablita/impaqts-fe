import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HTTP } from '../common/constants';
import { WORD_LIST_URL } from '../common/routes-constants';
import { FIND_FAILED } from '../model/constants';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { WordListResponse } from '../model/word-list-response';
import { UtilService } from '../utils/util.service';
import { InstallationService } from './installation.service';


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
    return this.http.post<QueryResponse>(`${endpoint}/${WORD_LIST_URL}`, queryRequest)
      .pipe(
        map(qr => qr ? qr.wordList : null),
        catchError(this.utils.handleErrorObservable('getWordList', FIND_FAILED, null)
        ));
  }
}