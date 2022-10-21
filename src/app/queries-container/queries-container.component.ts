import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { SELECT_CORPUS_LABEL } from '../common/label-constants';
import { CHARACTER, CQL, LEMMA, PHRASE, SIMPLE, WORD } from '../common/query-constants';
import { QUERY } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { INSTALLATION } from '../model/constants';
import { ContextConcordanceQueryRequestDTO } from '../model/context-concordance-query-request-dto';
import { FieldRequest } from '../model/field-request';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/metadatum';
import { ResultContext } from '../model/result-context';
import { DisplayPanelService } from '../services/display-panel.service';
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
  selector: 'app-concordance',
  templateUrl: './queries-container.component.html',
  styleUrls: ['./queries-container.component.scss']
})
export class QueriesContainerComponent implements OnInit, AfterViewInit {

  public contextConcordanceQueryRequestDTO: ContextConcordanceQueryRequestDTO = ContextConcordanceQueryRequestDTO.getInstance();

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
  public metadataAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });
  public textTypesAttributes: Array<KeyValueItem> = Array.from<KeyValueItem>({ length: 0 });

  public videoUrl: SafeResourceUrl | null = null;
  public displayModal = false;
  public resultContext: ResultContext | null = null;
  public colHeader: Array<string> = Array.from<string>({ length: 0 });
  public headerSortBy = '';
  public paginations: number[] = [10, 25, 50];
  public initialPagination = 10;

  public displayResultPanel = false;
  public categories: Array<string> = Array.from<string>({ length: 0 });
  public titleResult: string | null = null;
  public selectedCorpus: KeyValueItem | null = null;

  constructor(
    private readonly translateService: TranslateService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly emitterService: EmitterService,
    public readonly displayPanelService: DisplayPanelService,
  ) { }

  ngOnInit(): void {
    this.displayPanelService.reset();
    this.emitterService.pageMenu = QUERY;
    this.menuEmitterService.corpusSelected = false;
    this.menuEmitterService.menuEvent$.next(new MenuEvent(QUERY));
  }

  ngAfterViewInit(): void {
    this.init();
  }


  public makeCollocations(): void {
    this.titleResult = 'MENU.COLLOCATIONS';
    this.fieldRequest = FieldRequest.build(
      this.selectedCorpus,
      this.simpleResult,
      this.simple,
      this.lemma,
      this.phrase,
      this.word,
      this.character,
      this.cql,
      this.matchCase,
      this.selectedQueryType);
    this.emitterService.makeCollocation.next(this.fieldRequest);
  }

  public makeFrequency(): void {
    this.categories = this.queryRequestService.queryRequest.frequencyQueryRequest?.categories!;
    this.titleResult = 'MENU.FREQUENCY';
    this.fieldRequest = FieldRequest.build(
      this.selectedCorpus,
      this.simpleResult,
      this.simple,
      this.lemma,
      this.phrase,
      this.word,
      this.character,
      this.cql,
      this.matchCase,
      this.selectedQueryType);
    this.emitterService.makeFrequency.next(this.fieldRequest);
  }

  public displayOptionsPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.optionsPanelSubject;
  }

  public displayMetadataPanel(): BehaviorSubject<boolean> {
    return this.displayPanelService.metadataPanelSubject;
  }

  public setTitleResult(title: any): void {
    this.titleResult = title;
  }

  private init(): void {
    const inst = localStorage.getItem(INSTALLATION);

    if (inst) {
      this.installation = JSON.parse(inst) as Installation;
      this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
      this.corpusList.sort((c1, c2) => c1.value.toLocaleLowerCase().localeCompare(c2.value.toLocaleLowerCase()));
    }

    this.displayQueryType = false;
    this.hideQueryTypeAndContext();

    this.translateService.stream(SELECT_CORPUS_LABEL).subscribe({
      next: (res: any) => this.selectCorpus = res
    });

    this.queryTypes = [
      new KeyValueItem(SIMPLE, SIMPLE),
      new KeyValueItem(LEMMA, LEMMA),
      new KeyValueItem(WORD, WORD),
      new KeyValueItem(PHRASE, PHRASE),
      new KeyValueItem(CHARACTER, CHARACTER),
      new KeyValueItem(CQL, CQL)
    ];

    this.selectedQueryType = this.queryTypes[0];
    if (!!localStorage.getItem('selectedCorpus')) {
      this.selectedCorpus = JSON.parse(localStorage.getItem('selectedCorpus')!);
      this.simple = localStorage.getItem('simpleQuery')!;
      this.dropdownCorpus();
    }
  }

}
