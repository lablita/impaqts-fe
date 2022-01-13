import {
  ADMIN, ADVANCEDUSER, ALL_LEMMANS, ALL_WORDS, AS_SUBCORPUS, COLLOCATIONS,
  CONCORDANCE, COPYRIGHT_ROUTE, CORPUS_INFO, CREDITS_ROUTE, FILTER, FREQUENCY,
  MENU_ALL_LEMMANS, MENU_ALL_WORDS, MENU_AS_SUBCORPUS, MENU_COLL_OPTIONS, MENU_CONCORDANCE,
  MENU_COPYRIGHT, MENU_CORPUS_INFO, MENU_CREDITS, MENU_FILTER, MENU_FREQUENCY,
  MENU_LOGIN, MENU_RESULT_CONCORDANCE, MENU_SORT, MENU_VIEW_OPTION, MENU_VISUAL_QUERY,
  MENU_WORD_LIST, RESULT_CONCORDANCE, SORT, USER, VIEW_OPTIONS, VISUAL_QUERY, WORD_LIST
} from 'src/app/model/constants';
import { KeyValueItem } from 'src/app/model/key-value-item';
import { RoleMenu } from 'src/app/model/role-menu';

export const environment = {
  auth0Domain: 'impaqts.eu.auth0.com',
  auth0ClientId: 'rAsNaHfJQRR7Bsd5Xrq6Gig9yfqonITJ',
  production: true,
  installation: 'uno',
  installationName: 'IMPAQTS1',
  installationUrl: 'https://impaqts.drwolf.it/impaqts-configurator',
  queryServerProtocol: 'wss',
  queryServerHost: 'localhost:9000',
  RECONNECT_INTERVAL: 1000, // ms
  roles: [ADMIN, ADVANCEDUSER, USER],
  menuByRoleList: [
    new RoleMenu(ADMIN, [MENU_CORPUS_INFO, MENU_ALL_WORDS, MENU_ALL_LEMMANS, MENU_VISUAL_QUERY]),
    new RoleMenu(ADVANCEDUSER, [MENU_CORPUS_INFO, MENU_VISUAL_QUERY]),
    new RoleMenu(USER, [MENU_VISUAL_QUERY]),
  ],
  menuNoRole: [MENU_LOGIN, MENU_CONCORDANCE],
  menuRoutes: [
    new KeyValueItem(MENU_CONCORDANCE, CONCORDANCE),
    new KeyValueItem(MENU_CORPUS_INFO, CORPUS_INFO),
    new KeyValueItem(MENU_ALL_WORDS, ALL_WORDS),
    new KeyValueItem(MENU_ALL_LEMMANS, ALL_LEMMANS),
    new KeyValueItem(MENU_CREDITS, CREDITS_ROUTE),
    new KeyValueItem(MENU_COPYRIGHT, COPYRIGHT_ROUTE),
    new KeyValueItem(MENU_VISUAL_QUERY, VISUAL_QUERY),
    new KeyValueItem(MENU_RESULT_CONCORDANCE, RESULT_CONCORDANCE),
    new KeyValueItem(MENU_AS_SUBCORPUS, AS_SUBCORPUS),
    new KeyValueItem(MENU_VIEW_OPTION, VIEW_OPTIONS),
    new KeyValueItem(MENU_SORT, SORT),
    new KeyValueItem(MENU_FILTER, FILTER),
    new KeyValueItem(MENU_FREQUENCY, FREQUENCY),
    new KeyValueItem(MENU_COLL_OPTIONS, COLLOCATIONS),
    new KeyValueItem(MENU_WORD_LIST, WORD_LIST)
  ]
};
