import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CONTEXT_INSTALLATION, FIND_FAILED, INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private installationName: string;

  constructor(
    private readonly http: HttpClient,
    private readonly utils: UtilService,
  ) {
    this.installationName = environment.installationName;
  }

  public loadInstallation(): Promise<Installation | Observable<any>> {
    return this.http.get<Installation>(`${CONTEXT_INSTALLATION}/installation?installationName=${this.installationName}`)
      .toPromise()
      .then((installation: Installation) => {
        if (installation) {
          localStorage.setItem(INSTALLATION, JSON.stringify(installation));
        }
        return installation;
      })
      .catch(catchError(this.utils.handleErrorObservable('getInstallation', FIND_FAILED, null)));
  }
}
