import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HTTP, HTTPS } from '../common/constants';
import { EXPORT_CSV } from '../common/routes-constants';
import { EXPORT_FAILED, INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { QueryRequest } from '../model/query-request';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService
    ) { }

  public exportCvs(request: QueryRequest): Observable<string> {
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      const installation = JSON.parse(inst) as Installation;
      const endpoint = installation?.corpora.find(corp => corp.name === request.corpus)?.endpoint;
      const url = (environment.secureUrl ? HTTPS : HTTP) + endpoint;
      return this.http.post<string>(`${url}/${EXPORT_CSV}`, request)
      .pipe(catchError(this.utils.handleErrorObservable('exportCvs', EXPORT_FAILED, '')));
    } else {
      return of('');
    }
  }
}
