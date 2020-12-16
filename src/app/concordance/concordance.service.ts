import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CONTEXT_CORPORA, CONTEXT_INSTALLATION, FIND_FAILED } from '../model/constants';
import { Installation } from '../model/installation';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class ConcordanceService {

  private installationName: string;
  private installationUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService
  ) {
    this.installationName = environment.installationName;
    this.installationUrl = environment.installationUrl;
  }

  public getInstallation(): Observable<Installation> {
    return this.http.get<Installation>(`${CONTEXT_INSTALLATION}/installation?installationName=${this.installationName}`)
      .pipe(catchError(this.utils.handleErrorObservable('getInstallation', FIND_FAILED, null)));
  }

  public getMetadatumValues(corpus: string, metadatum: string): Observable<any> {
    return this.http.get<any>(`${CONTEXT_CORPORA}/metadatum-values/${corpus}/${metadatum}`)
      .pipe(catchError(this.utils.handleErrorObservable('getMetadatumValues', FIND_FAILED, null)));
  }
}
