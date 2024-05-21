import { Injectable, Query } from '@angular/core';
import { LazyLoadEvent, Message, TreeNode } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TEXT_TYPES_QUERY_REQUEST, TOKEN, VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES } from '../common/constants';
import {
  CHARACTER,
  CQL,
  IMPLICIT,
  LEMMA,
  PHRASE,
  REQUEST_TYPE,
  SIMPLE,
  TAG,
  WORD,
} from '../common/query-constants';
import {
  CONCORDANCE,
  RESULT_COLLOCATION,
  RESULT_CONCORDANCE,
  VISUAL_QUERY,
} from '../common/routes-constants';
import { MenuEmitterService } from '../menu/menu-emitter.service';
import { MenuEvent } from '../menu/menu.component';
import { FieldRequest } from '../model/field-request';
import { KeyValueItem } from '../model/key-value-item';
import { MetadataRequest } from '../model/metadata-request';
import { QueryPattern } from '../model/query-pattern';
import { QueryResponse } from '../model/query-response';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';
import { Selection } from '../model/selection';
import { DisplayPanelService } from './display-panel.service';
import { ErrorMessagesService } from './error-messages.service';
import { MetadataQueryService } from './metadata-query.service';
import { QueryRequestService } from './query-request.service';
import { RxWebsocketSubject } from './rx-websocket-subject';
import { SocketService } from './socket.service';
import { ViewOptionQueryRequest } from '../model/view-option-query-request';
import { AppInitializerService } from './app-initializer.service';
import { QueryRequest } from '../model/query-request';
import { Metadatum } from '../model/metadatum';

const ERROR_PREFIX = 'ERROR';
export class CollocationSortingParams {
  colHeader: Array<string> = [];
  headerSortBy = '';
}

const QUERY_TYPE = [
  CONCORDANCE, SIMPLE, LEMMA, PHRASE, WORD, CHARACTER, CQL, TAG
]

@Injectable({
  providedIn: 'root',
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
    new KeyValueItem('p', 'PAGE.COLLOCATION.MI_LOG_F'),
  ];

  private queryResponse$: Observable<QueryResponse | null> | null = null;
  private isImpaqtsCustom = false;

  constructor(
    private readonly metadataQueryService: MetadataQueryService,
    private readonly queryRequestService: QueryRequestService,
    private readonly socketService: SocketService,
    private readonly menuEmitterService: MenuEmitterService,
    private readonly displayPanelService: DisplayPanelService,
    private readonly errorMessagesService: ErrorMessagesService,
    private readonly appInitializerService: AppInitializerService
  ) {
    if (!this.socketService.getSocketSubject()) {
      this.socketService.connect();
      const socketServiceSubject = this.socketService.getSocketSubject();
      if (socketServiceSubject) {
        this.queryResponse$ = this.initWebSocket(socketServiceSubject);
      }
    }
    this.isImpaqtsCustom = this.appInitializerService.isImpactCustom();
  }

  public loadResults(
    fieldRequests: FieldRequest[],
    event?: LazyLoadEvent
  ): void {
    const queryRequest = this.queryRequestService.getQueryRequest();
    this.setMetadataQuery(queryRequest);
    this.setViewOptionQueryRequest();
    if (!!fieldRequests && fieldRequests.length > 0 && this.queryRequestService.getQueryRequest().viewOptionRequest.attributesCtx) {
      const fieldRequest = fieldRequests[fieldRequests.length - 1];
      if (!!fieldRequest.selectedCorpus) {
        if (event) {
          if (
            event.first !== undefined &&
            event.first !== null &&
            event.rows !== undefined &&
            event.rows !== null
          ) {
            queryRequest.start = event.first;
            queryRequest.end = queryRequest.start + event.rows;
          }
          if (
            queryRequest.queryType === REQUEST_TYPE.COLLOCATION_REQUEST &&
            queryRequest.collocationQueryRequest
          ) {
            // collocation sorting
            const sortBy = this.colHeaderList.find(
              (c) => c.value === event.sortField
            )?.key;
            queryRequest.collocationQueryRequest.sortBy =
              sortBy !== null && sortBy !== undefined ? sortBy : 'm';
          }
        }
        if (queryRequest.queryType === REQUEST_TYPE.VISUAL_QUERY_REQUEST) {
          queryRequest.queryPattern?.structPattern.tags.forEach(tags => {
            tags.forEach(tag => {
              const structTagToken = tag.name.split('.');
              tag.name = structTagToken[structTagToken.length - 1];
            })
          })
          queryRequest.corpus = fieldRequest.selectedCorpus.value;
          queryRequest.impaqts = this.isImpaqtsCustom;
          this.socketService.sendMessage(queryRequest);
        } else {
          // !VISUAL_QUERY_REQUEST
          const queryTags: QueryTag[] = [];
          let tag: QueryTag;
          switch (fieldRequest.selectedQueryType) {
            case WORD:
              fieldRequest.simpleResult = fieldRequest.word;
              tag = new QueryTag(TOKEN, 'word', fieldRequest.word);
              tag.matchCase = fieldRequest.matchCase;
              queryTags.push(tag);
              break;
            case LEMMA:
              fieldRequest.simpleResult = fieldRequest.lemma;
              queryTags.push(new QueryTag(TOKEN, 'lemma', fieldRequest.lemma));
              break;
            case PHRASE:
              fieldRequest.simpleResult = fieldRequest.phrase;
              queryTags.push(
                new QueryTag(TOKEN, 'phrase', fieldRequest.phrase)
              );
              break;
            case CHARACTER:
              fieldRequest.simpleResult = fieldRequest.character;
              queryTags.push(
                new QueryTag(TOKEN, 'character', fieldRequest.character)
              );
              break;
            case CQL:
              fieldRequest.simpleResult = fieldRequest.cql;
              queryTags.push(new QueryTag(TOKEN, 'cql', fieldRequest.cql));
              break;
            case IMPLICIT:
              fieldRequest.simpleResult = fieldRequest.cql;
              /* 
                //TODO
                fieldRequest.implict?? come lo si tratta??
              */
              queryTags.push(new QueryTag(TOKEN, 'cql', fieldRequest.cql));
              break;
            default: // SIMPLE
              fieldRequest.simpleResult = fieldRequest.simple;
          }
          if (!queryRequest.queryPattern) {
            queryRequest.queryPattern = new QueryPattern();
          }
          if (QUERY_TYPE.includes(fieldRequest.selectedQueryType!)) {
            queryRequest.queryPattern.tokPattern = [];
          }
          if (fieldRequest.selectedQueryType === SIMPLE) {
            fieldRequest.simpleResult
              .split(' ')
              .forEach((simpleResultToken) => {
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
          //replace empty string with .* everywhere
          const queryPatternToSend: QueryPattern = this.queryRequestService.replaceEmptyStringWithWildcard(queryRequest.queryPattern);
          queryRequest.queryPattern = queryPatternToSend;
          
          if (this.metadataQuery) {
            queryRequest.queryPattern.structPattern = this.metadataQuery;
          }
          queryRequest.corpus = fieldRequest.selectedCorpus.value;
          // quick sort
          if (
            queryRequest.queryType === REQUEST_TYPE.SORT_REQUEST &&
            fieldRequest.quickSort
          ) {
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
          if (
            queryRequest.queryType ===
            REQUEST_TYPE.METADATA_FREQUENCY_QUERY_REQUEST
          ) {
            queryRequest.impaqts = this.isImpaqtsCustom;
            this.socketService.sendMessage(queryRequest);
          } else {
            queryRequest.impaqts = this.isImpaqtsCustom;
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
    if (
      queryRequest.collocationQueryRequest?.showFunc &&
      queryRequest.collocationQueryRequest?.showFunc?.length > 0
    ) {
      const colHeader = [
        'PAGE.COLLOCATION.CONC_COUNT',
        'PAGE.COLLOCATION.CAND_COUNT',
      ];
      queryRequest.collocationQueryRequest.showFunc.forEach((f) =>
        colHeader.push(this.colHeaderList.filter((h) => h.key === f)[0].value)
      );
      collocationSortingParams.colHeader = colHeader;
    }
    const sortBy = queryRequest.collocationQueryRequest?.sortBy
      ? queryRequest.collocationQueryRequest?.sortBy
      : 'm';
    collocationSortingParams.headerSortBy = this.colHeaderList.filter(
      (h) => h.key === sortBy
    )[0].value;
    return collocationSortingParams;
  }

  public getQueryResponse$(): Observable<QueryResponse | null> {
    if (this.queryResponse$) {
      return this.queryResponse$;
    }
    return of(null);
  }

  private setMetadataQuery(queryRequest: QueryRequest): void {
    const isImplicitRequest = queryRequest.queryType === REQUEST_TYPE.IMPLICIT_REQUEST;
    const metadataGroupedList = this.metadataQueryService.getMetadataGroupedList();
    
    /** Metadata */
    const metadataRequest = new MetadataRequest();
    this.metadataQueryService.getMetadata().forEach((md) => {
      if (!!md.selection && !!md.selection.toString()) {
        if (md.freeText) {
          // freetxt
          metadataRequest.freeTexts.push(
            new Selection(md.name, md.selection as string)
          );
        } else if (
          !md.multipleChoice &&
          md.tree &&
          md.tree[0] &&
          md.tree[0].children &&
          md.tree[0].children.length > 0
        ) {
          // single
          metadataRequest.singleSelects.push(
            new Selection(md.name, (md.selection as TreeNode).key)
          );
        } else {
          // multi
          const values: string[] = [];
          (md.selection as TreeNode[]).forEach((m) => {
            if (m.key) {
              values.push(m.key);
            }
          });
          metadataRequest.multiSelects.push(
            new Selection(md.name, undefined, values)
          );
        }
      }
    });
    if (REQUEST_TYPE.VISUAL_QUERY_REQUEST !== this.queryRequestService.getQueryRequest().queryType &&
      (metadataRequest.freeTexts.length > 0 || metadataRequest.multiSelects.length > 0 || metadataRequest.singleSelects.length > 0)) {
      localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(metadataRequest));
    }

    //group IMPLICIT
    let metadataImplicit: Metadatum[] | undefined;
    if (isImplicitRequest) {
      metadataImplicit = metadataGroupedList.find(mg => IMPLICIT === mg.metadatumGroup.name)?.metadata;
    }

    // Tutto in OR
    const implicitQueryTag: QueryTag[] = [];
    this.metadataQuery = new QueryToken();
    if (metadataRequest.freeTexts && metadataRequest.freeTexts.length > 0) {
      metadataRequest.freeTexts.forEach((ft) => {
        const structTagTokens = ft.key?.split('.');
        if (structTagTokens) {
          const structTag = structTagTokens[0];
          if (ft.key) {
            const tag = new QueryTag(structTag);
            this.getTagFromFreeText(structTagTokens, tag, ft);
            if (metadataImplicit && metadataImplicit.find(m => m.name === tag.structure + '.' + tag.name)) {
              implicitQueryTag.push(tag);
            } else {
              this.metadataQuery!.tags.push([tag]);
            }
          }
        }
      });
    }
    if (
      metadataRequest.multiSelects &&
      metadataRequest.multiSelects.length > 0
    ) {
      metadataRequest.multiSelects.forEach((ms) => {
        if (ms.values) {
          const tags: QueryTag[] = [];
          ms.values.forEach((v) => {
            const structTagTokens = ms.key?.split('.');
            if (structTagTokens) {
              const tag = this.getTagFromMultiselect(structTagTokens, v, ms.key);
              if (metadataImplicit && metadataImplicit.find(m => m.name === tag.structure + '.' + tag.name)) {
                implicitQueryTag.push(tag);
              } else {
                tags.push(tag);
              }
            }
          });
          if (this.metadataQuery && tags.length > 0) {
            this.metadataQuery.tags.push(tags);
          }
        }
      });
    }
    if (
      metadataRequest.singleSelects &&
      metadataRequest.singleSelects.length > 0
    ) {
      const singleSelect = metadataRequest.singleSelects[0];
      if (singleSelect.value) {
        const tag = this.getTagFromSingleselect(singleSelect);
        if (metadataImplicit && metadataImplicit.find(m => m.name === tag.structure + '.' + tag.name)) {
          implicitQueryTag.push(tag);
        } else {
          this.metadataQuery.tags.push([tag]);
        }
      }
    }
    //Tag Impliciti tutti in or fra di loro
    if (implicitQueryTag.length > 0) {
      this.metadataQuery.tags.push(implicitQueryTag);
    }
  }
  
  private getTagFromFreeText(structTagTokens: string[],tag: QueryTag, ft: Selection): QueryTag {
    if (structTagTokens.length > 1) {
      tag.name = structTagTokens[1];
    } else {
      tag.name = ft.key;
    }
    if (ft.value) {
      tag.value = ft.value;
    }
    return tag;
  } 

  private getTagFromSingleselect(ss: Selection): QueryTag {
    const tag = new QueryTag(ss.value!);
    tag.name = ss.key;
    tag.value = ss.value!;
    return tag;
  }

  private getTagFromMultiselect(structTagTokens: string[], value: string, key: string): QueryTag {
      const structTag = structTagTokens[0];
      const tag = new QueryTag(structTag);
      if (structTagTokens.length > 1) {
        tag.name = structTagTokens[1];
      } else {
        tag.name = key;
      }
      tag.value = value;
      return tag;
  }

  private setViewOptionQueryRequest(): void {
    const voqr = localStorage.getItem(VIEW_OPTION_QUERY_REQUEST_ATTRIBUTES);
    let corpusAttributesSelected = this.metadataQueryService.getDefaultMetadataAttributes();
    if (voqr) {
      corpusAttributesSelected = JSON.parse(voqr);
    }
    const viewOptionQueryRequest = new ViewOptionQueryRequest();
    viewOptionQueryRequest.attributesKwic = corpusAttributesSelected.map(att => att.value);
    viewOptionQueryRequest.attributesCtx = corpusAttributesSelected.map(att => att.value);
    this.queryRequestService.getQueryRequest().viewOptionRequest = viewOptionQueryRequest;
  }

  private initWebSocket(
    socketServiceSubject: RxWebsocketSubject
  ): Observable<QueryResponse | null> {
    // TODO: add distinctUntilChanged with custom comparison
    return socketServiceSubject.pipe(
      map((resp) => {
        const queryResponse = resp as QueryResponse;
        if (queryResponse && queryResponse.errorResponse) {
          if (queryResponse.errorResponse.errorCode === 403) {
            return this.handleForbiddenResponse(queryResponse);
          }
          queryResponse.error = true;
          return queryResponse;
        } else {
          return this.handleQueryResponse(queryResponse);
        }
      }),
      catchError((err) => {
        throw err;
      }),
      tap({
        next: (val) => console.log(val),
        error: (err) => console.error(err),
        complete: () => console.log('IMPAQTS WS disconnected'),
      })
    );
  }

  private handleQueryResponse(resp: QueryResponse): QueryResponse {
    let corpusSelected = true;
    const qr = resp as QueryResponse;
    if (qr) {
      if (qr.kwicLines) {
        this.menuEmitterService.menuEvent$.next(
          this.queryRequestService.getQueryRequest().queryType === REQUEST_TYPE.VISUAL_QUERY_REQUEST
            ? new MenuEvent(VISUAL_QUERY) : new MenuEvent(RESULT_CONCORDANCE)
        );
      } else if (qr.collocations && qr.collocations.length > 0) {
        this.menuEmitterService.menuEvent$.next(
          new MenuEvent(RESULT_COLLOCATION)
        );
      } else if (
        qr.frequency &&
        this.queryRequestService.getQueryRequest().frequencyQueryRequest
      ) {
        this.menuEmitterService.menuEvent$.next(
          new MenuEvent(RESULT_COLLOCATION)
        );
      }
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
    forbiddenMessage.detail =
      'Non hai i permessi per eseguire la query richiesta';
    this.errorMessagesService.sendError(forbiddenMessage);
    return null;
  }
}
