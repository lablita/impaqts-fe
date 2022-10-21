import { Injectable } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { STRUCT_DOC, TEXT_TYPES_QUERY_REQUEST, TOKEN } from '../common/constants';
import { CHARACTER, CQL, LEMMA, PHRASE, SIMPLE, WORD } from '../common/query-constants';
import { RESULT_COLLOCATION, RESULT_CONCORDANCE } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { ContextConcordanceQueryRequest } from '../model/context-concordance-query-request';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';
import { DisplayPanelService } from './display-panel.service';
import { MetadataQueryService } from './metadata-query.service';
import { QueryRequestService } from './query-request.service';
import { RxWebsocketSubject } from './rx-websocket-subject';
import { SocketService } from './socket.service';

export class CollocationSortingParams {
  colHeader: Array<string> = Array.from<string>({ length: 0 });
  headerSortBy = '';
}

@Injectable({
  providedIn: 'root'
})
export class LoadResultsService {

  /** private */
  private metadataQuery: QueryToken | null = null;

  private readonly ERROR_PREFIX = 'ERROR';

  private readonly colHeaderList: KeyValueItem[] = [
    new KeyValueItem('f', 'PAGE.COLLOCATION.CONC_COUNT'),
    new KeyValueItem('F', 'PAGE.COLLOCATION.CAND_COUNT'),
    new KeyValueItem('t', 'PAGE.COLLOCATION.T_SCORE'),
    new KeyValueItem('m', 'PAGE.COLLOCATION.MI'),
    new KeyValueItem('3', 'PAGE.COLLOCATION.MI3'),
    new KeyValueItem('l', 'PAGE.COLLOCATION.LOG_LIKELIHOOD'),
    new KeyValueItem('s', 'PAGE.COLLOCATION.MIN_SENS'),
    new KeyValueItem('d', 'PAGE.COLLOCATION.LOG_DICE'),
    new KeyValueItem('p', 'PAGE.COLLOCATION.MI_LOG_F')
  ];

  private readonly queryResponse$: Observable<QueryResponse | null> | null = null;

  constructor(
    private readonly metadataQueryService: MetadataQueryService,
    private readonly queryRequestService: QueryRequestService,
    private readonly socketService: SocketService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly displayPanelService: DisplayPanelService,
  ) {
    if (!this.socketService.getSocketSubject()) {
      this.socketService.connect();
      const socketServiceSubject = this.socketService.getSocketSubject();
      if (socketServiceSubject) {
        this.queryResponse$ = this.initWebSocket(socketServiceSubject);
      }
    }
  }

  public loadResults(fieldRequests: FieldRequest[], event?: LazyLoadEvent, qp?: QueryPattern | null): void {
    this.setMetadataQuery();
    if (!!fieldRequests && fieldRequests.length > 0 || !!qp) {
      const fieldRequest = fieldRequests[fieldRequests.length - 1]
      if (!!fieldRequest.selectedCorpus) {
        const qr: QueryRequest = !!qp ? new QueryRequest() : JSON.parse(JSON.stringify(this.queryRequestService.queryRequest));
        if (!event) {
          qr.start = 0;
          qr.end = 10;
        } else {
          if (event.first !== undefined && event.first !== null && event.rows !== undefined && event.rows !== null) {
            qr.start = event.first;
            qr.end = qr.start + event.rows;
          }
          if (qr.collocationQueryRequest !== null && event.sortField !== undefined && event.sortField !== null) {
            //collocation sorting
            const sortBy = this.colHeaderList.find(c => c.value === event.sortField)?.key;
            qr.collocationQueryRequest.sortBy = (sortBy !== null && sortBy !== undefined) ? sortBy : 'm';
          }
        }
        if (!!qp) {
          //VisualQuery
          qr.corpus = fieldRequest.selectedCorpus.key;
          qr.queryPattern = qp;
          this.socketService.sendMessage(qr);
        } else {
          const queryTags: QueryTag[] = [];
          let tag: QueryTag;
          switch (fieldRequest.selectedQueryType?.key) {
            case WORD:
              fieldRequest.simpleResult = fieldRequest.word;
              tag = this.tagBuilder('word', fieldRequest.word);
              tag.matchCase = fieldRequest.matchCase;
              queryTags.push(tag);
              break;
            case LEMMA:
              fieldRequest.simpleResult = fieldRequest.lemma;
              queryTags.push(this.tagBuilder('lemma', fieldRequest.lemma));
              break;
            case PHRASE:
              fieldRequest.simpleResult = fieldRequest.phrase;
              queryTags.push(this.tagBuilder('phrase', fieldRequest.phrase));
              break;
            case CHARACTER:
              fieldRequest.simpleResult = fieldRequest.character;
              queryTags.push(this.tagBuilder('character', fieldRequest.character));
              break;
            case CQL:
              fieldRequest.simpleResult = fieldRequest.cql;
              tag = this.tagBuilder('cql', fieldRequest.cql);
              queryTags.push(this.tagBuilder('cql', fieldRequest.cql));
              break;
            default: //SIMPLE
              fieldRequest.simpleResult = fieldRequest.simple;
          }
          qr.queryPattern = new QueryPattern();
          qr.queryPattern.tokPattern = Array.from<QueryToken>({ length: 0 });
          if (fieldRequest.selectedQueryType?.key === SIMPLE) {
            fieldRequest.simpleResult.split(' ').forEach(simpleResultToken => {
              const token = new QueryToken();
              token.tags.push([]);
              const tagWord = new QueryTag(TOKEN);
              tagWord.name = 'lemma';
              tagWord.value = simpleResultToken;
              const tagLemma = new QueryTag(TOKEN);
              tagLemma.name = 'word';
              tagLemma.value = simpleResultToken;
              token.tags[0].push(tagWord);
              token.tags[0].push(tagLemma);
              qr.queryPattern.tokPattern.push(token);
            })
          } else {
            const simpleQueryToken = new QueryToken(TOKEN);
            simpleQueryToken.tags[0] = queryTags;
            qr.queryPattern.tokPattern.push(simpleQueryToken);
          }
          if (this.metadataQuery) {
            qr.queryPattern.structPattern = this.metadataQuery;
          }
          qr.corpus = fieldRequest.selectedCorpus.key;
          /**quick sort */
          if (fieldRequest.quickSort) {
            qr.start = 0;
            qr.end = qr.end > 0 ? qr.end : 10;
            qr.sortQueryRequest = fieldRequest.quickSort;
          }
          /**context */
          if (fieldRequest.contextConcordance && fieldRequest.contextConcordance?.lemma) {
            const contextConcordanceQueryRequest = new ContextConcordanceQueryRequest(
              fieldRequest.contextConcordance?.window.key,
              fieldRequest.contextConcordance?.token,
              fieldRequest.contextConcordance?.lemma,
              fieldRequest.contextConcordance?.item.key
            );
            qr.contextConcordanceQueryRequest = contextConcordanceQueryRequest;
            this.queryRequestService.setContextConcordance(qr.contextConcordanceQueryRequest);
            // this.queryRequestService.queryRequest.contextConcordanceQueryRequest = qr.contextConcordanceQueryRequest;
          } else {
            // remove context query param if present in previous queries
            qr.contextConcordanceQueryRequest = null;
            this.queryRequestService.queryRequest.contextConcordanceQueryRequest = null;
          }
          console.log('queryRequest: ' + JSON.stringify(this.queryRequestService.queryRequest));
          /**frequency */
          if (qr.frequencyQueryRequest && qr.frequencyQueryRequest?.categories && qr.frequencyQueryRequest?.categories.length > 0) {
            qr.frequencyQueryRequest?.categories.forEach(cat => {
              qr.frequencyQueryRequest!.category = cat;
              this.socketService.sendMessage(qr);
            });
          } else {
            this.socketService.sendMessage(qr);
          }
        }
      }
    }
  }

  public getCollocationSortingParams(): CollocationSortingParams {
    const qr: QueryRequest = JSON.parse(JSON.stringify(this.queryRequestService.queryRequest));
    /** return collocation sorting params */
    const collocationSortingParams = new CollocationSortingParams();
    if (qr.collocationQueryRequest?.showFunc && qr.collocationQueryRequest?.showFunc?.length > 0) {
      const colHeader = ['PAGE.COLLOCATION.CONC_COUNT', 'PAGE.COLLOCATION.CAND_COUNT'];
      qr.collocationQueryRequest.showFunc.forEach(f => colHeader.push(this.colHeaderList.filter(h => h.key === f)[0].value));
      collocationSortingParams.colHeader = colHeader;
    }
    const sortBy = this.queryRequestService.queryRequest.collocationQueryRequest?.sortBy
      ? this.queryRequestService.queryRequest.collocationQueryRequest?.sortBy : 'm';
    collocationSortingParams.headerSortBy = this.colHeaderList.filter(h => h.key === sortBy)[0].value;
    return collocationSortingParams;
  }

  public getQueryResponse$(): Observable<QueryResponse | null> {
    if (this.queryResponse$) {
      return this.queryResponse$;
    }
    return of(null);
  }

  private setMetadataQuery(): void {
    /** Metadata */
    const textTypesRequest = new TextTypesRequest();
    this.metadataQueryService.metadata.forEach(md => {
      if (!!md.selection) {
        if (md.freeText) {
          // freetxt
          textTypesRequest.freeTexts.push(new Selection(md.name, md.selection as string));
        } else if (!md.multipleChoice && md.tree && md.tree[0] && md.tree[0].children && md.tree[0].children.length > 0) {
          // single
          textTypesRequest.singleSelects.push(new Selection(md.name, (md.selection as TreeNode).label));
        } else {
          // multi
          const values: string[] = [];
          (md.selection as TreeNode[]).forEach(m => {
            if (m.label) {
              values.push(m.label);
            }
          });
          textTypesRequest.multiSelects.push(new Selection(md.name, undefined, values));
        }
      }
    });
    localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(textTypesRequest));
    // Tutto in OR
    this.metadataQuery = new QueryToken();
    if (textTypesRequest.freeTexts && textTypesRequest.freeTexts.length > 0) {
      textTypesRequest.freeTexts.forEach(ft => {
        const tag = new QueryTag(STRUCT_DOC);
        if (ft.value) {
          tag.name = ft.key;
          tag.value = ft.value;
          if (this.metadataQuery) {
            this.metadataQuery.tags.push([tag]);
          }
        }
      });
    }
    if (textTypesRequest.multiSelects && textTypesRequest.multiSelects.length > 0) {
      textTypesRequest.multiSelects.forEach(ms => {
        if (ms.values) {
          ms.values.forEach(v => {
            const tag = new QueryTag(STRUCT_DOC);
            tag.name = ms.key;
            tag.value = v;
            if (this.metadataQuery) {
              this.metadataQuery.tags.push([tag]);
            }
          });
        }
      });
    }
    if (textTypesRequest.singleSelects && textTypesRequest.singleSelects.length > 0) {
      const tag = new QueryTag(STRUCT_DOC);
      const singleSelect = textTypesRequest.singleSelects[0];
      if (singleSelect && singleSelect.value) {
        tag.name = singleSelect.key;
        tag.value = singleSelect.value;
        this.metadataQuery.tags.push([tag]);
      }
    }
  }

  private tagBuilder(type: string, value: string): QueryTag {
    const tag = new QueryTag(TOKEN);
    tag.name = type;
    tag.value = value;
    return tag;
  }

  private initWebSocket(socketServiceSubject: RxWebsocketSubject): Observable<QueryResponse | null> {
    // TODO: add distinctUntilChanged with custom comparison
    return socketServiceSubject.pipe(
      //tap(resp => console.log(resp)),
      map(resp => {
        if (resp && JSON.stringify(resp).indexOf(`"${this.ERROR_PREFIX}`) === 0) {
          resp = new QueryResponse();
          resp.error = true;
          return resp;
        } else {
          return this.handleQueryResponse(resp);
        }
      }),
      catchError(err => { throw err; }),
      tap({
        next: val => console.log(val),
        error: err => console.error(err),
        complete: () => console.log('IMPAQTS WS disconnected')
      })
    );
  }

  private handleQueryResponse(resp: any): QueryResponse {
    let corpusSelected = true;
    const qr = resp as QueryResponse;
    if (qr.kwicLines && qr.kwicLines.length > 0) {
      this.menuEmitterService.menuEvent$.next(new MenuEvent(RESULT_CONCORDANCE));
    } else if (qr.collocations && qr.collocations.length > 0) {
      this.menuEmitterService.menuEvent$.next(new MenuEvent(RESULT_COLLOCATION));
    } else if (qr.frequency) {
      this.menuEmitterService.menuEvent$.next(new MenuEvent(RESULT_COLLOCATION));
    } else {
      corpusSelected = false;
    }
    this.displayPanelService.activeOptionsButton();
    this.menuEmitterService.corpusSelected = corpusSelected;
    return qr;
  }


}
