import { CollocationOptionsQueryRequest } from '../model/collocation-options-query-request';
import {
  FIRST, LEFT, NODE, OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
  OPTIONAL_DISPLAY_ATTR_URL_KWIC, REPUBBLICA, WORD
} from '../model/constants';
import { FilterOptionsQueryRequest } from '../model/filter-options-query.request';
import { FreqOptionsQueryRequest } from '../model/freq-options-query_request';
import { KeyValueItem } from '../model/key-value-item';
import { SortOptionsQueryRequest } from '../model/sort-options-query-request';
import { Startup } from '../model/startup';
import { ViewOptionsQueryRequest } from '../model/view-options-query-request';
import { WordListOptionsQueryRequest } from '../model/word-list-options-query-request';

const startUp1 = new Startup(
  [
    new KeyValueItem('susanne', 'susanne'),
    new KeyValueItem('wikiita', 'wikiita')
  ],
  new ViewOptionsQueryRequest(
    [],
    [],
    [],
    OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH,
    false,
    false,
    20,
    40,
    false,
    false,
    100,
    false,
    false,
    false,
    false,
    false,
    false
  ), new WordListOptionsQueryRequest(
    null,
    null,
    false,
    2,
    null,
    5,
    0,
    null,
    null,
    false,
    null,
    null,
    null,
    null,
    1,
    null,
    null,
    null
  ), new SortOptionsQueryRequest(
    new KeyValueItem(WORD, WORD),
    new KeyValueItem(LEFT, LEFT),
    3,
    false,
    false,
    [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL')],
    [new KeyValueItem(WORD, WORD)],
    [false, false, false],
    [false, false, false],
    [new KeyValueItem(NODE, NODE)],
  ), new FreqOptionsQueryRequest(
    0,
    new KeyValueItem(FIRST, FIRST),
    new KeyValueItem(WORD, WORD),
    false,
    new KeyValueItem(NODE, NODE),
    0,
    false,
    []
  ), new CollocationOptionsQueryRequest(
    null,
    -5,
    5,
    5,
    3,
    []
  ), new FilterOptionsQueryRequest(
    new KeyValueItem('POSITIVE', 'POSITIVE'),
    new KeyValueItem(FIRST, FIRST),
    -5,
    5,
    false
  )
);

const startUp2 = new Startup(
  [
    new KeyValueItem('1', 'AcWac EU'),
    new KeyValueItem('2', 'Brexit IT'),
    new KeyValueItem(REPUBBLICA, 'Repubblica')
  ],
  new ViewOptionsQueryRequest(
    [],
    [],
    [],
    OPTIONAL_DISPLAY_ATTR_URL_KWIC,
    false,
    false,
    30,
    60,
    false,
    false,
    200,
    false,
    false,
    false,
    false,
    false,
    false
  ), new WordListOptionsQueryRequest(
    null,
    null,
    false,
    4,
    null,
    10,
    0,
    null,
    null,
    false,
    null,
    null,
    null,
    null,
    10,
    null,
    null,
    null
  ), new SortOptionsQueryRequest(
    new KeyValueItem(WORD, WORD),
    new KeyValueItem(LEFT, LEFT),
    3,
    false,
    false,
    [new KeyValueItem('FIRST_LEVEL', 'FIRST_LEVEL')],
    [new KeyValueItem(WORD, WORD)],
    [false],
    [false],
    [new KeyValueItem(NODE, NODE)],
  ), new FreqOptionsQueryRequest(
    0,
    new KeyValueItem(FIRST, FIRST),
    new KeyValueItem(WORD, WORD),
    false,
    new KeyValueItem(NODE, NODE),
    0,
    false,
    []
  ), new CollocationOptionsQueryRequest(
    null,
    -5,
    5,
    5,
    3,
    []
  ), new FilterOptionsQueryRequest(
    new KeyValueItem('POSITIVE', 'POSITIVE'),
    new KeyValueItem(FIRST, FIRST),
    -5,
    5,
    false
  )
);

export const INSTALLATION_LIST = [
  {
    index: 'uno',
    startup: startUp1,
  },
  {
    index: 'due',
    startup: startUp2
  }
];
