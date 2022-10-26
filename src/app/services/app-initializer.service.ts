import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FIND_FAILED, INSTALLATION } from '../model/constants';
import { Corpus } from '../model/corpus';
import { Installation } from '../model/installation';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private readonly installationName: string;

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
  ) {
    this.installationName = environment.installationName;
  }

  public loadInstallation(): Promise<Installation | Observable<any>> {
    return this.http.get<Installation>(`${environment.installationUrl}/installation?installationName=${this.installationName}`)
      .toPromise()
      .then((installation: Installation) => {
        if (installation) {
          localStorage.setItem(INSTALLATION, JSON.stringify(installation));
        }
        return installation;
      })
      .catch(catchError(this.utils.handleErrorObservable('getInstallation', FIND_FAILED, null)));
  }

  public loadCorpus(idCorpus: number): Observable<Corpus> {
    return this.http.get<Corpus>(`${environment.installationUrl}/corpus/${idCorpus}`);
  }
}
