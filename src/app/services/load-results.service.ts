import { Injectable } from '@angular/core';
import { LazyLoadEvent, Message, TreeNode } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { STRUCT_DOC, TEXT_TYPES_QUERY_REQUEST, TOKEN } from '../common/constants';
import { CHARACTER, CQL, LEMMA, PHRASE, REQUEST_TYPE, SIMPLE, WORD } from '../common/query-constants';
import { RESULT_COLLOCATION, RESULT_CONCORDANCE } from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { QueryPattern } from '../model/query-pattern';
import { QueryResponse } from '../model/query-response';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';
import { DisplayPanelService } from './display-panel.service';
import { ErrorMessagesService } from './error-messages.service';
import { MetadataQueryService } from './metadata-query.service';
import { QueryRequestService } from './query-request.service';
import { RxWebsocketSubject } from './rx-websocket-subject';
import { SocketService } from './socket.service';

const ERROR_PREFIX = 'ERROR';
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

  private queryResponse$: Observable<QueryResponse | null> | null = null;

  constructor(
    private readonly metadataQueryService: MetadataQueryService,
    private readonly queryRequestService: QueryRequestService,
    private readonly socketService: SocketService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly displayPanelService: DisplayPanelService,
    private readonly errorMessagesService: ErrorMessagesService
  ) {
    if (!this.socketService.getSocketSubject()) {
      this.socketService.connect();
      const socketServiceSubject = this.socketService.getSocketSubject();
      if (socketServiceSubject) {
        this.queryResponse$ = this.initWebSocket(socketServiceSubject);
      }
    }
  }

  public loadResults(fieldRequests: FieldRequest[], event?: LazyLoadEvent): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    this.setMetadataQuery();
    if (!!fieldRequests && fieldRequests.length > 0) {
      const fieldRequest = fieldRequests[fieldRequests.length - 1];
      if (!!fieldRequest.selectedCorpus) {
        if (!event) {
          queryRequest.start = 0;
          queryRequest.end = 10;
        } else {
          if (event.first !== undefined && event.first !== null && event.rows !== undefined && event.rows !== null) {
            queryRequest.start = event.first;
            queryRequest.end = queryRequest.start + event.rows;
          }
          if (queryRequest.queryType === REQUEST_TYPE.COLLOCATION_REQUEST && queryRequest.collocationQueryRequest) {
            // collocation sorting
            const sortBy = this.colHeaderList.find(c => c.value === event.sortField)?.key;
            queryRequest.collocationQueryRequest.sortBy = (sortBy !== null && sortBy !== undefined) ? sortBy : 'm';
          }
        }
        if (queryRequest.queryType === REQUEST_TYPE.VISUAL_QUERY_REQUEST) {
          // VisualQuery
          queryRequest.corpus = fieldRequest.selectedCorpus.value;
          this.socketService.sendMessage(queryRequest);
        } else {
          // !VISUAL_QUERY_REQUEST
          const queryTags: QueryTag[] = [];
          let tag: QueryTag;
          switch (fieldRequest.selectedQueryType?.key) {
            case WORD:
              fieldRequest.simpleResult = fieldRequest.word;
              tag = new QueryTag('word', fieldRequest.word);
              tag.matchCase = fieldRequest.matchCase;
              queryTags.push(tag);
              break;
            case LEMMA:
              fieldRequest.simpleResult = fieldRequest.lemma;
              queryTags.push(new QueryTag('lemma', fieldRequest.lemma));
              break;
            case PHRASE:
              fieldRequest.simpleResult = fieldRequest.phrase;
              queryTags.push(new QueryTag('phrase', fieldRequest.phrase));
              break;
            case CHARACTER:
              fieldRequest.simpleResult = fieldRequest.character;
              queryTags.push(new QueryTag('character', fieldRequest.character));
              break;
            case CQL:
              fieldRequest.simpleResult = fieldRequest.cql;
              tag = new QueryTag('cql', fieldRequest.cql);
              queryTags.push(new QueryTag('cql', fieldRequest.cql));
              break;
            default: // SIMPLE
              fieldRequest.simpleResult = fieldRequest.simple;
          }
          if (!queryRequest.queryPattern) {
            queryRequest.queryPattern = new QueryPattern();
            queryRequest.queryPattern.tokPattern = Array.from<QueryToken>({ length: 0 });
          }
          if (fieldRequest.selectedQueryType?.key === SIMPLE) {
            queryRequest.queryPattern?.tokPattern.splice(0, queryRequest.queryPattern.tokPattern.length);
            if (queryRequest.queryType !== REQUEST_TYPE.POSITIVE_FREQUEQUENCY_CONCORDANCE_QUERY_REQUEST) {
            }
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
              queryRequest.queryPattern?.tokPattern.push(token);
            });
          } else {
            const simpleQueryToken = new QueryToken(TOKEN);
            simpleQueryToken.tags[0] = queryTags;
            queryRequest.queryPattern.tokPattern.push(simpleQueryToken);
          }
          if (this.metadataQuery) {
            queryRequest.queryPattern.structPattern = this.metadataQuery;
          }
          queryRequest.corpus = fieldRequest.selectedCorpus.value;
          // quick sort
          if (queryRequest.queryType === REQUEST_TYPE.QUICK_SORT_REQUEST && fieldRequest.quickSort) {
            queryRequest.start = 0;
            queryRequest.end = queryRequest.end > 0 ? queryRequest.end : 10;
            queryRequest.sortQueryRequest = fieldRequest.quickSort;
          }
          // context
          if (queryRequest.queryType !== REQUEST_TYPE.CONTEXT_QUERY_REQUEST) {
            // remove context query param if present in previous queries
            queryRequest.contextConcordanceQueryRequest = null;
          }
          // frequency
          if (queryRequest.queryType === REQUEST_TYPE.CONC_FREQUENCY_QUERY_REQUEST) {
            this.socketService.sendMessage(queryRequest);
          } else {
            this.socketService.sendMessage(queryRequest);
          }
        }
        console.log('queryRequest: ' + JSON.stringify(queryRequest));
      }
    }
  }

  public getCollocationSortingParams(): CollocationSortingParams {
    const queryRequest = this.queryRequestService.getQueryRequest();
    /** return collocation sorting params */
    const collocationSortingParams = new CollocationSortingParams();
    if (queryRequest.collocationQueryRequest?.showFunc && queryRequest.collocationQueryRequest?.showFunc?.length > 0) {
      const colHeader = ['PAGE.COLLOCATION.CONC_COUNT', 'PAGE.COLLOCATION.CAND_COUNT'];
      queryRequest.collocationQueryRequest.showFunc.forEach(f => colHeader.push(this.colHeaderList.filter(h => h.key === f)[0].value));
      collocationSortingParams.colHeader = colHeader;
    }
    const sortBy = queryRequest.collocationQueryRequest?.sortBy
      ? queryRequest.collocationQueryRequest?.sortBy : 'm';
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
    this.metadataQueryService.getMetadata().forEach(md => {
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
      const tagsInAnd: Array<Array<QueryTag>> = [];
      textTypesRequest.multiSelects.forEach(ms => {
        const tagsInOr: Array<QueryTag> = [];
        if (ms.values) {
          ms.values.forEach(v => {
            const tag = new QueryTag(STRUCT_DOC);
            tag.name = ms.key;
            tag.value = v;
            tagsInOr.push(tag);
          });
        }
        tagsInAnd.push(tagsInOr);
      });
      if (this.metadataQuery) {
        this.metadataQuery.tags = tagsInAnd;
      }
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

  // private tagBuilder(type: string, value: string): QueryTag {
  //   const tag = new QueryTag(TOKEN);
  //   tag.name = type;
  //   tag.value = value;
  //   return tag;
  // }

  private initWebSocket(socketServiceSubject: RxWebsocketSubject): Observable<QueryResponse | null> {
    // TODO: add distinctUntilChanged with custom comparison
    return socketServiceSubject.pipe(
      map(resp => {
        let queryResponse = resp as QueryResponse;
        if (queryResponse && queryResponse.errorResponse) {
          if (queryResponse.errorResponse.errorCode === 403) {
            return this.handleForbiddenResponse(queryResponse);
          }
          queryResponse = new QueryResponse();
          queryResponse.error = true;
          return queryResponse;
        } else {
          return this.handleQueryResponse(queryResponse);
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

  private handleQueryResponse(resp: QueryResponse): QueryResponse {
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

  private handleForbiddenResponse(resp: QueryResponse): null {
    const forbiddenMessage = {} as Message;
    forbiddenMessage.severity = 'error';
    forbiddenMessage.summary = 'Autorizzazione negata';
    forbiddenMessage.detail = 'Non hai i permessi per eseguire la query richiesta';
    this.errorMessagesService.sendError(forbiddenMessage);
    return null;
  }
}
