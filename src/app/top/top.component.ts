import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INSTALLATION, LOGIN, LOGOUT, TOP_LEFT, TOP_RIGHT } from '../model/constants';
import { Installation } from '../model/installation';
import { AuthorizationService } from '../services/authorization.service';
import { EmitterService } from '../utils/emitter.service';
import { KeyValueItem } from '../model/key-value-item';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CorpusSelectionService } from '../services/corpus-selection.service';
@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})

export class TopComponent implements OnInit{

  public urlTopLeft: string | null = null;
  public urlTopRight: string | null = null;
  public authLabel = '';
  public name: string | null = null;
  public role: string | null = null;
  public email: string | null = null;
  public corpusList: KeyValueItem[] = [];
  public selectCorpus = SELECT_CORPUS_LABEL;
  public selectedCorpus: KeyValueItem | null = null;

  private installation?: Installation;

  constructor(
    private readonly emitterService: EmitterService,
    private readonly authorizationService: AuthorizationService,
    private readonly corpusSelectionService: CorpusSelectionService
  ) {
    this.init();
  }

  ngOnInit(): void {
    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(`${corpus.id}`, corpus.name)));
      this.corpusList.sort((c1, c2) => c1.value.toLocaleLowerCase().localeCompare(c2.value.toLocaleLowerCase()));
    }
     const lsSelectedCorpus = localStorage.getItem('selectedCorpus');
      if (lsSelectedCorpus) {
        this.selectedCorpus = JSON.parse(lsSelectedCorpus);
        this.corpusSelectionService.setSelectedCorpus(this.selectedCorpus!);
        this.corpusSelectionService.corpusSelectedSubject.next(this.selectedCorpus!);
      }
  }

  private init(): void {
    this.emitterService.user.subscribe(
      {
        next: user => {
          this.authLabel = !!user.role ? LOGOUT : LOGIN;
        }
      });

    const inst = localStorage.getItem(INSTALLATION);
    if (inst) {
      const installation = JSON.parse(inst) as Installation;
      if (installation.logos && installation.logos.length > 0) {
        installation.logos.forEach(logo => {
          if (logo.position === TOP_LEFT) {
            this.urlTopLeft = logo.url;
          } else if (logo.position === TOP_RIGHT) {
            this.urlTopRight = logo.url;
          }
        });
      }
    }
  }

  public loginLogout(): void {
    if (this.authLabel === LOGOUT) {
      this.authorizationService.logout();
    } else {
      this.authorizationService.loginWithRedirect();
    }
  }

  public corpusSelect(): void {
    if (this.selectedCorpus) {
      this.corpusSelectionService.setSelectedCorpus(this.selectedCorpus);
      localStorage.setItem('selectedCorpus', JSON.stringify(this.selectedCorpus));
      this.corpusSelectionService.corpusSelectedSubject.next(this.selectedCorpus!);
    }
  }

}
