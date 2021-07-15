import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { STRUCT_DOC } from '../common/constants';
import { CONTEXT_CORPORA, CONTEXT_INSTALLATION, FIND_FAILED } from '../model/constants';
import { Installation } from '../model/installation';
import { Metadatum } from '../model/Metadatum';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class ConcordanceService {

  private installationName: string;

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService
  ) {
    this.installationName = environment.installationName;
  }

  public getInstallation(): Observable<Installation> {
    return this.http.get<Installation>(`${CONTEXT_INSTALLATION}/installation?installationName=${this.installationName}`)
      .pipe(catchError(this.utils.handleErrorObservable('getInstallation', FIND_FAILED, null)));
  }

  public getMetadatumValues(corpus: string, metadatum: string): Observable<any> {
    return this.http.get<any>(`${CONTEXT_CORPORA}/metadatum-values/${corpus}/${metadatum}`)
      .pipe(catchError(this.utils.handleErrorObservable('getMetadatumValues', FIND_FAILED, null)));
  }

  public getMetadatumValuesWithMetadatum(corpus: string, metadatum: Metadatum): Observable<any> {
    return this.http.get<any>(`${CONTEXT_CORPORA}/metadatum-values/${corpus}/${STRUCT_DOC}.${metadatum.name}`)
      .pipe(map(res => {
        return { res, metadatum };
      }), catchError(this.utils.handleErrorObservable('getMetadatumValues', FIND_FAILED, null)));
  }

}
