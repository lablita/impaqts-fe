import { Injectable } from '@angular/core';
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
import { Metadatum } from '../model/metadatum';
import { QueryPattern } from '../model/query-pattern';
import { QueryRequest } from '../model/query-request';
import { QueryResponse } from '../model/query-response';
import { QueryTag } from '../model/query-tag';
import { QueryToken } from '../model/query-token';
import { Selection } from '../model/selection';
import { ViewOptionQueryRequest } from '../model/view-option-query-request';
import { EmitterService } from '../utils/emitter.service';
import { AppInitializerService } from './app-initializer.service';
import { DisplayPanelService } from './display-panel.service';
import { ErrorMessagesService } from './error-messages.service';
import { MetadataQueryService } from './metadata-query.service';
import { QueryRequestService } from './query-request.service';
import { RxWebsocketSubject } from './rx-websocket-subject';
import { SocketService } from './socket.service';

const ERROR_PREFIX = 'ERROR';
export class CollocationSortingParams {
  colHeader: Array<string> = [];
  headerSortBy = '';
}

const QUERY_TYPE = [
  CONCORDANCE, SIMPLE, LEMMA, PHRASE, WORD, CHARACTER, CQL, TAG
];

export const STRUCTURE_IMPLICIT_METADATA = [
  'top', 'ppp', 'impl', 'vag'
];

const COMMENT = 'comment';

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
    private readonly appInitializerService: AppInitializerService,
    private readonly emitterService: EmitterService,
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
    let implicitQueryTag: QueryTag[] = this.setMetadataQuery(queryRequest);
    this.setViewOptionQueryRequest();
    if (!!fieldRequests && fieldRequests.length > 0 && this.queryRequestService.getQueryRequest().viewOptionRequest.attributesCtx) {
      const fieldRequest = fieldRequests[fieldRequests.length - 1];
      //IMPLICIT
      if (queryRequest.queryType === REQUEST_TYPE.IMPLICIT_REQUEST) {
        let containsWord: string | null = null;
        if (this.queryRequestService.getBasicFieldRequest()) {
          containsWord = this.queryRequestService.getBasicFieldRequest()!.implicit;
        }
        const commentImpl = this.retrieveCommentIfExist4ImplicitQuery();
        implicitQueryTag = this.implicitCommentNormalization(implicitQueryTag);
        if (implicitQueryTag.length > 0) {
          const structImpl: string[] = [...new Set(implicitQueryTag.map(qt =>
            '<' + qt.structure + (commentImpl ? ' comment=".*' + commentImpl + '.*" ' : '') + '/>'))];
          fieldRequest.cql = structImpl.join(' | ');
          this.queryRequestService.getQueryRequest().cql = structImpl.join(' | ');
        } else {
          fieldRequest.cql = '<impl' + (commentImpl ? ' comment=".*' + commentImpl + '.*" ' : '') + '/> | <top' + (commentImpl ? ' comment=".*' + commentImpl + '.*" ' : '') + '/> | <vag' + (commentImpl ? ' comment=".*' + commentImpl + '.*" ' : '') + '/> | <ppp' + (commentImpl ? ' comment=".*' + commentImpl + '.*" ' : '') + '/>';
          this.queryRequestService.getQueryRequest().cql = fieldRequest.cql;
        }
        if (containsWord) {
          const str = ` containing [word="${containsWord}" | lemma="${containsWord}"]`;
          fieldRequest.cql = fieldRequest.cql + str;
          this.queryRequestService.getQueryRequest().cql = fieldRequest.cql;
        }
        const tagListFunctionImplicit: QueryTag[] = [];
        this.metadataQuery?.tags.forEach(tagList => {
          if (tagList.length === 1 && tagList[0].name === 'function') {
            const value = tagList[0].value;
            if (implicitQueryTag.length > 0) {
              implicitQueryTag.forEach(iqt => {
                if (tagListFunctionImplicit.filter(tag => tag.structure === iqt.structure).length === 0) {
                  const tag: QueryTag = new QueryTag(iqt.structure, 'function', `.*${value}.*`);
                  tagListFunctionImplicit.push(tag);
                }
              });
            } else {
              STRUCTURE_IMPLICIT_METADATA.forEach(iqt => {
                const tag: QueryTag = new QueryTag(iqt, 'function', `.*${value}.*`);
                tagListFunctionImplicit.push(tag);
              });
            }
          }
        });
        if (this.metadataQuery && this.metadataQuery.tags) {
          this.metadataQuery.tags = this.metadataQuery?.tags.filter(tagList => tagList[0].name !== 'function');
          if (tagListFunctionImplicit.length > 0) {
            this.metadataQuery.tags.push(tagListFunctionImplicit);
          }
        }
      }
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
            });
          });
          queryRequest.corpus = fieldRequest.selectedCorpus.value;
          queryRequest.impaqts = this.isImpaqtsCustom;
          if (queryRequest.queryPattern && queryRequest.queryPattern.structPattern) {
            queryRequest.queryPattern.structPattern.tags = this.commentNormalization(queryRequest.queryPattern.structPattern.tags);
          }
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
            if (fieldRequest.selectedQueryType !== IMPLICIT) {
              //se presente il metadato comment (label esplicitazione nel Filtro Panel)
              let tagComment: QueryTag | undefined = undefined;
              this.metadataQueryService.retrieveStructPattern(this.metadataQuery).tags.forEach(tags => {
                tagComment = tags.find(tag => tag.name === 'comment');
              });
              if (tagComment) {

                this.metadataQuery.tags = this.commentNormalization(this.metadataQueryService.retrieveStructPattern(this.metadataQuery).tags);
                const commentRefactoring = this.commentRefactoring(this.metadataQuery.tags);
                const queryToken: QueryToken = new QueryToken();
                queryToken.tags = commentRefactoring.tags;
                // queryRequest.queryPattern.tokPattern[0].tags.push(commentRefactoring.tags[0]);
                // queryRequest.queryPattern.tokPattern[0].tags.push(commentRefactoring.tags[0]);
                queryRequest.queryPattern.tokPattern.push(queryToken);
                queryRequest.cql = commentRefactoring.cql;
              } else {
                queryRequest.queryPattern.structPattern = this.metadataQueryService.retrieveStructPattern(this.metadataQuery);
              }
            } else {
              queryRequest.queryPattern.structPattern = JSON.parse(JSON.stringify(this.metadataQuery));
              queryRequest.queryPattern.structPattern.tags = queryRequest.queryPattern.structPattern.tags.map(tags =>
                tags.filter(tag => tag.name !== COMMENT)
              );
              queryRequest.queryPattern.structPattern.tags = queryRequest.queryPattern.structPattern.tags.filter(tags => tags.length > 0);
            }
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
            if (this.queryRequestService.getSortQueryRequest()) {
              queryRequest.sortQueryRequest = this.queryRequestService.getSortQueryRequest();
            }
            this.socketService.sendMessage(queryRequest);
          }
        }
        console.log('queryRequest: ' + JSON.stringify(queryRequest));
      }
    }
  }

  private implicitCommentNormalization(tags: QueryTag[]): QueryTag[] {
    let tagComment: QueryTag | undefined = undefined;
    tagComment = tags.find(tag => tag.name === 'comment');
    let commentStructures = new Set<string>();
    if (tagComment) {
      tags.forEach(tag => {
        if (STRUCTURE_IMPLICIT_METADATA.join(',').indexOf(tag.structure) > -1) {
          commentStructures.add(tag.structure);
        }
      });
      if (commentStructures.size === 0) {
        commentStructures = new Set(STRUCTURE_IMPLICIT_METADATA);
      }
      commentStructures.forEach(structure => {
        const tag: QueryTag = JSON.parse(JSON.stringify(tagComment));
        tag.structure = structure;
        tags.push(tag);
      });
      tags = tags.filter(tag => tag.structure !== 'comment');
    }
    return tags;
  }

  private commentRefactoring(tags: QueryTag[][]): { cql: string, tags: QueryTag[][] } {
    let cql = '';
    let tagComment: QueryTag | undefined = undefined;
    const newTags: QueryTag[] = [];
    tags.forEach(tags => {
      tagComment = tags.find(tag => tag.name === 'comment');
    });
    if (tagComment) {
      tags = tags.map(tags => {
        if (tags.find(tag => tag.name === 'comment')) {
          tags.forEach((tag, index) => {
            if (STRUCTURE_IMPLICIT_METADATA.join(',').indexOf(tag.structure) > -1 && tag.name === 'type') {
              if (index === 0) {
                cql += '(';
              } else {
                cql += ' | ';
              }
              cql += `<${tag.structure} type='${tag.value}' & comment='${tagComment?.value}' />`;
            }
          });
          cql += ')';
          tags = tags.filter(tag => tag.name !== 'comment');
          tags = tags.filter(tag => tag.name !== 'type');
          const tag: QueryTag = new QueryTag(TOKEN, 'cql', cql);
          tags.push(tag);
        }
        return tags;
      });
    }
    return { cql: cql, tags: tags };
  }

  private commentNormalization(tags: QueryTag[][]): QueryTag[][] {
    let tagComment: QueryTag | undefined = undefined;
    tags.forEach(tags => {
      tagComment = tags.find(tag => tag.name === 'comment');
    });
    let commentStructures = new Set<string>();
    if (tagComment) {
      tags.forEach(tags => {
        tags.forEach(tag => {
          if (STRUCTURE_IMPLICIT_METADATA.join(',').indexOf(tag.structure) > -1) {
            commentStructures.add(tag.structure);
          }
        });
      });
      if (commentStructures.size === 0) {
        commentStructures = new Set(STRUCTURE_IMPLICIT_METADATA);
      }
      tags = tags.map(tags => {
        if (tags.find(tag => tag.structure === 'comment')) {
          commentStructures.forEach(structure => {
            const tag: QueryTag = JSON.parse(JSON.stringify(tagComment));
            tag.value = '.*' + tag.value + '.*';
            tag.structure = structure;
            tags.push(tag);
          });
          return tags.filter(tag => tag.structure !== 'comment');
        }
        return tags;
      });
    }
    return tags;
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

  private setMetadataQuery(queryRequest: QueryRequest): QueryTag[] {
    const isImplicitRequest = this.isImpaqtsCustom;
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
    if (REQUEST_TYPE.VISUAL_QUERY_REQUEST !== this.queryRequestService.getQueryRequest().queryType) {
      if ((metadataRequest.freeTexts.length > 0 || metadataRequest.multiSelects.length > 0 || metadataRequest.singleSelects.length > 0)) {
        localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(metadataRequest));
      }
      this.emitterService.localStorageSubject.next();
    }
    //group IMPLICIT
    let metadataImplicit: Metadatum[] | undefined;
    if (isImplicitRequest) {
      metadataImplicit = metadataGroupedList.find(mg => IMPLICIT === mg.metadatumGroup.name)?.metadata;
    }
    let implicitQueryTag: QueryTag[] = [];
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
    //remove tag parent 
    implicitQueryTag = implicitQueryTag.filter(tag => tag.value.indexOf('.') < 0);
    //Tag Impliciti tutti in or fra di loro
    if (implicitQueryTag.length > 0) {
      this.metadataQuery.tags.push(implicitQueryTag);
    }
    return implicitQueryTag;
  }

  private retrieveCommentIfExist4ImplicitQuery(): string {
    let result = '';
    // const isImplicitRequest = this.isImpaqtsCustom;
    const metadataGroupedList = this.metadataQueryService.getMetadataGroupedList();
    if (this.isImpaqtsCustom) {
      const metadataImplicit = metadataGroupedList.find(mg => IMPLICIT === mg.metadatumGroup.name)?.metadata;
      if (metadataImplicit) {
        const commentTag = metadataImplicit.find(mt => mt.name.indexOf(COMMENT) > -1);
        if (commentTag && commentTag.selection) {
          result = '' + commentTag.selection;
        }
      }
    }
    return result;
  }

  private getTagFromFreeText(structTagTokens: string[], tag: QueryTag, ft: Selection): QueryTag {
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
