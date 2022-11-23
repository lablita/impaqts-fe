import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { ResultContext } from '../model/result-context';
import { AuthorizationService } from '../services/authorization.service';
import { DisplayPanelService } from '../services/display-panel.service';
import { QueryRequestService } from '../services/query-request.service';
import { EmitterService } from '../utils/emitter.service';

export class ConcordanceRequest {
  fieldRequest: FieldRequest = new FieldRequest();
  sortOptions: string[] = [];

  constructor(fieldRequest: FieldRequest, typeSearch: string[]) {
    this.fieldRequest = fieldRequest;
    this.sortOptions = typeSearch;
  }
}

@Component({
  selector: 'app-queries-container',
  templateUrl: './queries-container.component.html',
  styleUrls: ['./queries-container.component.scss']
})
export class QueriesContainerComponent implements OnInit {

  public contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequest = new ContextConcordanceQueryRequest();

  /** public */
  public metadataTextTypes: Metadatum[] = [];

  public titleOption: KeyValueItem | null = null;

  public attributesSelection: string[] = [];
  public viewOptionsLabel = '';
  public wordListOptionsLabel = '';
  public visualQueryOptionsLabel = '';
  public sortOptionsLabel = '';
  public freqOptionsLabel = '';
  public collocationOptionsLabel = '';
  public filterOptionsLabel = '';
  public totalResults = 0;
  public metadataAttributes: Array<KeyValueItem> = [];
  public textTypesAttributes: Array<KeyValueItem> = [];

  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public resultContext: ResultContext | null = null;
  public colHeader: Array<string> = [];
  public headerSortBy = '';
  public paginations: number[] = [10, 25, 50];
  public initialPagination = 10;

  public displayResultPanel = false;
  public categories: Array<string> = [];
  public titleResult: string | null = 'MENU.CONCORDANCE';
  public selectedCorpus: KeyValueItem | null = null;

  // modale che avverte l'utente che non può accedere all'installazione
  public displayNotAllowedUserForInstallation = false;

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    public readonly displayPanelService: DisplayPanelService,
    private readonly queryRequestService: QueryRequestService
  ) { }

  ngOnInit(): void {
    this.authorizationService.checkInstallationAuthorization().subscribe({
      next: allowed => this.displayNotAllowedUserForInstallation = !allowed
    });
    this.displayPanelService.reset();
    this.emitterService.pageMenu = QUERY;
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.menuEvent$.next(new MenuEvent(QUERY));
  }

  public setTitleResult(event: string): void {
    this.titleResult = event;
  }

  public setMetadataAttributes(event: Array<KeyValueItem>): void {
    this.metadataAttributes = event;
  }

  public setTextTypesAttributes(event: Array<KeyValueItem>): void {
    this.textTypesAttributes = event;

  }

  public displayConcordances(): void {
    this.titleResult = 'MENU.CONCORDANCE';
  }

  public displayCollocations(): void {
    this.titleResult = 'MENU.COLLOCATIONS';
  }

  public displayFrequency(): void {
    this.titleResult = 'MENU.FREQUENCY';
    const queryRequest = this.queryRequestService.getQueryRequest();
    if (queryRequest.frequencyQueryRequest &&
      queryRequest.frequencyQueryRequest.categories) {
      this.categories = queryRequest.frequencyQueryRequest.categories;
    }
    const basicFieldRequest = this.queryRequestService.getBasicFieldRequest();
    if (basicFieldRequest) {
      this.emitterService.makeFrequency.next(basicFieldRequest);
    }

  }

  public displayOptionsPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.optionsPanelSubject;
  }

  public displayMetadataPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.metadataPanelSubject;
  }

  public setSelectedCorpus(selectedCorpus: KeyValueItem): void {
    this.selectedCorpus = selectedCorpus;
  }

  public confirmNotAllowed(): void {
    this.authorizationService.logout();
  }

}
