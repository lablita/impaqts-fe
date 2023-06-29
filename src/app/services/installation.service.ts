import { Injectable } from '@angular/core';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { HTTP, HTTPS, WS, WSS, WS_URL } from '../common/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstallationService {

  private installation?: Installation;

  constructor(

  ) {
    const inst = localStorage.getItem(INSTALLATION);
   if (inst) {
      this.installation = JSON.parse(inst) as Installation;
    }
   }


   public getInstallation(): Installation | null {
    if (this.installation) {
      return this.installation;
    }
    return null;
   }

   public getEndpoint(corpus: string): string | null {
    const endpoint = this.installation?.corpora.find(corp => corp.name === corpus)?.endpoint;
    if (endpoint) {
      return endpoint;
    }
    return null;
   }

   public getSecureUrl(corpus: string): boolean | null {
    const secureUrl = this.installation?.corpora.find(corp => corp.name === corpus)?.secureUrl;
    if (secureUrl) {
      return secureUrl;
    }
    return null;
   }

   public getCompleteEndpoint(corpus: string, protocol: string): string | null {
    let endpoint = this.installation?.corpora.find(corp => corp.name === corpus)?.endpoint;
    const secureUrl = this.installation?.corpora.find(corp => corp.name === corpus)?.secureUrl;
    if (endpoint) {
      if (protocol === WS) { // WebSocket
        if (environment.production) {
          endpoint = `${endpoint}/${WS_URL}`;
          endpoint = secureUrl ? WSS + endpoint : WS + endpoint;
        } else {
          endpoint = `${endpoint}/${WS_URL}`;
          endpoint = secureUrl ? WSS + 'localhost:4200' + endpoint : WS + 'localhost:4200' + endpoint;
        }
        return endpoint;
      } // HTTP
      if (environment.production) {
        endpoint = (secureUrl ? HTTPS : HTTP) + endpoint;
      }
      return endpoint;
    }
    return null;
   }




}
