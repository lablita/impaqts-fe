import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { STRUCT_DOC, TOKEN, WS_URL } from '../common/constants';
import { INSTALLATION } from '../model/constants';
import { Installation } from '../model/installation';
import { KeyValueItem } from '../model/key-value-item';
import { KWICline } from '../model/kwicline';
import { Metadatum } from '../model/Metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryToken } from '../model/query-token';
import { EmitterService } from '../utils/emitter.service';
import { MetadataUtilService } from '../utils/metadata-util.service';

@Component({
  selector: 'app-visual-query',
  templateUrl: './visual-query.component.html',
  styleUrls: ['./visual-query.component.scss']
})

export class VisualQueryComponent implements OnInit, OnDestroy {

  public queryPattern: QueryPattern = new QueryPattern();
  public typeListQuery: KeyValueItem[] = [new KeyValueItem('word', 'word'), new KeyValueItem('lemma', 'lemma'), new KeyValueItem('tag', 'tag'), new KeyValueItem('status', 'status'), new KeyValueItem('lc', 'lc'), new KeyValueItem('lemma_lc', 'lemma_lc')];
  public optionList: KeyValueItem[] = [new KeyValueItem('1', 'repeat'), new KeyValueItem('2', 'sentence start'), new KeyValueItem('3', 'sentence end')];

  public metadataTextTypes: Metadatum[];
  public metadata: QueryToken[] = [];

  public installation: Installation;
  public corpusList: KeyValueItem[] = [];
  public selectedCorpus: KeyValueItem;
  public selectCorpus = 'PAGE.CONCORDANCE.SELECT_CORPUS';

  public totalResults = 0;
  public simpleResult: string;
  public kwicLines: KWICline[];
  public TotalKwicline: KWICline[];

  public loading = 0;
  public res: KeyValueItem[] = [];
  public enableAddToken = false;
  public enableAddMetadata = false;
  public enableSpinner = false;

  public visualQueryOptionsLabel: string;
  public viewOptionsLabel: string;

  private websocketVQ: WebSocketSubject<any>;
  private simple: string;

  constructor(
    private readonly translateService: TranslateService,
    private readonly emitterService: EmitterService,
    private readonly metadataUtilService: MetadataUtilService
  ) { }

  ngOnDestroy(): void {
    this.websocketVQ.unsubscribe();
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.installation = JSON.parse(localStorage.getItem(INSTALLATION)) as Installation;
    this.installation.corpora.forEach(corpus => this.corpusList.push(new KeyValueItem(corpus.name, corpus.name)));
    this.translateService.stream('MENU.VISUAL_QUERY').subscribe(res => this.emitterService.clickLabel.emit(res));

    /** Web Socket */
    const url = `ws://localhost:9000${WS_URL}`;
    this.websocketVQ = webSocket(url);
    this.websocketVQ.asObservable().subscribe(
      resp => {
        const qr = resp as QueryResponse;
        if (qr.kwicLines.length > 0) {
          this.kwicLines = (resp as QueryResponse).kwicLines;
        }
        this.totalResults = qr.currentSize;
        this.simpleResult = this.simple;
      },
      err => console.error(err),
      () => console.log('Activiti WS disconnected')
    );
  }

  public addTokenQuery(): void {
    const token = new QueryToken(TOKEN);
    this.queryPattern.tokPattern.push(token);
  }

  public deleteTokenQuery(token: QueryToken): void {
    this.queryPattern.tokPattern.splice(this.queryPattern.tokPattern.indexOf(token), 1);
  }

  public addTokenMetadata(): void {
    const token = new QueryToken(STRUCT_DOC);
    this.metadata.push(token);
  }

  public deleteTokenMetadata(token: QueryToken): void {
    this.metadata.splice(this.queryPattern.tokPattern.indexOf(token), 1);
  }

  public loadConcordances(event?: LazyLoadEvent): void {
    this.queryPattern.structPattern = this.metadata[0];

    const qr = new QueryRequest();
    qr.queryPattern = this.queryPattern;
    if (!event) {
      qr.start = 0;
      qr.end = 10;
    } else {
      qr.start = event.first;
      qr.end = qr.start + event.rows;
    }
    qr.corpus = this.selectedCorpus.key;
    this.websocketVQ.next(qr);
  }

  public dropdownCorpus(): void {
    if (this.selectedCorpus) {
      this.enableSpinner = true;
      this.enableAddToken = true;
      this.metadataUtilService.createMatadataTree(this.selectedCorpus.key, this.installation, true).subscribe(res => {
        this.metadataTextTypes = res['md'];
        this.enableAddMetadata = res['ended'];
        if (this.enableAddMetadata) {
          //ordinamento position 
          this.metadataTextTypes.sort((a, b) => a.position - b.position);
          this.enableSpinner = false;
        }
      });
    } else {
      this.enableAddToken = false;
      this.enableAddMetadata = false;
      this.enableSpinner = false;
    }
  }

  public getMetadatumTextTypes(): Metadatum[] {
    return this.metadataTextTypes;
  }

  public queryTokenOK(): boolean {
    let result = false;
    this.queryPattern.tokPattern.forEach(pt => pt.tags.forEach(tg => tg.forEach(t => {
      if (t?.name?.length) {
        result = true;
      }
    })));
    return result;
  }

}
