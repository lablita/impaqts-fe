import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private readonly utils: UtilService,
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

  public async download(downloadUrl: string): Promise<void> {
    // Download the document as a blob
    const response = await this.http.get(
     downloadUrl,
     { responseType: 'blob', observe: 'response' }
   ).toPromise();

   // Create a URL for the blob
   const url = URL.createObjectURL(response.body!);

   // Create an anchor element to "point" to it
   const anchor = document.createElement('a');
   anchor.href = url;

   // Get the suggested filename for the file from the response headers
   anchor.download = this.getFilenameFromHeaders(response.headers) || 'file';

   // Simulate a click on our anchor element
   anchor.click();

   // Discard the object data
   URL.revokeObjectURL(url);
 }

 private getFilenameFromHeaders(headers: HttpHeaders) {
   // The content-disposition header should include a suggested filename for the file
   const contentDisposition = headers.get('Content-Disposition');
   if (!contentDisposition) {
     return null;
   }

   /* StackOverflow is full of RegEx-es for parsing the content-disposition header,
   * but that's overkill for my purposes, since I have a known back-end with
   * predictable behaviour. I can afford to assume that the content-disposition
   * header looks like the example in the docs
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
   *
   * In other words, it'll be something like this:
   *    Content-Disposition: attachment; filename="filename.ext"
   *
   * I probably should allow for single and double quotes (or no quotes) around
   * the filename. I don't need to worry about character-encoding since all of
   * the filenames I generate on the server side should be vanilla ASCII.
   */

   const leadIn = 'filename=';
   const start = contentDisposition.search(leadIn);
   if (start < 0) {
     return null;
   }

   // Get the 'value' after the filename= part (which may be enclosed in quotes)
   const value = contentDisposition.substring(start + leadIn.length).trim();
   if (value.length === 0) {
     return null;
   }

   // If it's not quoted, we can return the whole thing
   const firstCharacter = value[0];
   if (firstCharacter !== '\"' && firstCharacter !== '\'') {
     return value;
   }

   // If it's quoted, it must have a matching end-quote
   if (value.length < 2) {
     return null;
   }

   // The end-quote must match the opening quote
   const lastCharacter = value[value.length - 1];
   if (lastCharacter !== firstCharacter) {
     return null;
   }

   // Return the content of the quotes
   return value.substring(1, value.length - 1);
 }
}
