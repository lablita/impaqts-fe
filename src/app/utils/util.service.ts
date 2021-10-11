import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilService implements OnDestroy {


  public changeContentLanguage: Subject<string> = new Subject<string>();

  private contentLanguageSet: string = '';
  private readonly fallback = 'eng';

  constructor(
    private readonly translateService: TranslateService,
    private readonly router: Router,
  ) {
    this.changeContentLanguage.subscribe(lang => {
      this.setContentLanguage(lang);
    });
  }

  public ngOnDestroy(): void {
    if (this.changeContentLanguage) {
      this.changeContentLanguage.unsubscribe();
    }
  }

  public handleErrorObservable<T>(operation = 'operation', message?: string, result?: T) {
    return (error: any): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `${operation} error : Backend returned code ${error.status}`, error);
      }
      if (message) {
        console.error(`Error ${message}`);
      }
      switch (error.status) {
        case 401:
          // logout and redirect to home
          this.handleUnauthorized();
          break;
        case 403:
          // forbidden
          this.handleForbidden();
          break;
        default:
          break;
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    };
  }

  private handleUnauthorized(): void {
    this.router.navigate(['/auth-handler']);
  }

  private handleForbidden(): void {
    this.notifyErrorTranslation('AUTHORIZATION_ERROR');
  }

  public isArray(obj: any) {
    return Array.isArray(obj);
  }

  public sortNumber(a: number, b: number): number {
    return a - b;
  }

  public getContentLanguage(): string {
    if (this.contentLanguageSet) {
      return this.contentLanguageSet;
    }
    return this.fallback;
  }

  public getFallbackLanguage(): string {
    return this.fallback;
  }

  public getEvaluationColor(cod: string): string {
    if (cod.indexOf('R') === 0) {
      return '#dc3545';
    } else if (cod.indexOf('G') === 0) {
      return '#ffc107';
    } else if (cod.indexOf('V') === 0) {
      return '#28a745';
    }
    return '#cccccc';
  }

  public notifyError(message: string): void {
    console.log(message);
  }

  public notifyErrorTranslation(translation: string): void {
    this.translateService.stream(translation)
      .subscribe((message: string) => this.notifyError(message));
  }

  public notifySuccessTranslation(translation: string): void {
    this.translateService.stream(translation)
      .subscribe((message: string) =>
        console.log(message)
      );
  }

  public setContentLanguage(language: string): void {
    this.contentLanguageSet = language;
  }

}
