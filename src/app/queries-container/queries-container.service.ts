import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HTTP, HTTPS } from '../common/constants';
import { CONTEXT_INSTALLATION, FIND_FAILED } from '../model/constants';
import { Corpus } from '../model/corpus';
import { Installation } from '../model/installation';
import { Metadatum } from '../model/metadatum';
import { UtilService } from '../utils/util.service';
import { InstallationService } from '../services/installation.service';


@Injectable({
  providedIn: 'root'
})
export class QueriesContainerService {

  private readonly installationName: string;

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
    private readonly installationServices: InstallationService
  ) {
    this.installationName = environment.installationName;

  }

  public getInstallation(): Observable<Installation | null> {
    return this.http.get<Installation>(`${CONTEXT_INSTALLATION}/installation?installationName=${this.installationName}`)
      .pipe(catchError(this.utils.handleErrorObservable('getInstallation', FIND_FAILED, null)));
  }

  public getMetadatumValues(corpus: string, metadatum: string): Observable<any> {
    const endpoint = this.installationServices.getCompleteEndpoint(corpus, HTTP);
    return this.http.get<any>(`${endpoint}/metadatum-values/${corpus}/${metadatum}`)
      .pipe(catchError(this.utils.handleErrorObservable('getMetadatumValues', FIND_FAILED, null)));
  }

  public getMetadatumValuesWithMetadatum(installation: Installation, corpusId: string, metadatum: Metadatum): Observable<any> {
    const corpus: Corpus | undefined = installation?.corpora.find(corp => corp.id === +corpusId);
    if (corpus) {
      const corpusName = corpus.name;
      const endpoint = this.installationServices.getCompleteEndpoint(corpusName, HTTP);
      return this.http.get<any>(`${endpoint}/metadatum-values/${corpusName}/${metadatum.name}`)
        .pipe(map(res => {
          return { res, metadatum };
        }), catchError(this.utils.handleErrorObservable('getMetadatumValues', FIND_FAILED, null)));
    }
    return of(null);
  }

}
