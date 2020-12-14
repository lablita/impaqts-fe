import { FIRST, LEFT, NODE, OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, OPTIONAL_DISPLAY_ATTR_URL_KWIC, REPUBBLICA, WORD } from '../model/constants';
import { CorpusShort } from '../model/dropdown-item';
import { FreqOptionsQueryRequest } from '../model/freq-options-query_request';
import { SortOptionsQueryRequest } from '../model/sort-options-query-request';
import { Startup } from '../model/startup';
import { ViewOptionsQueryRequest } from '../model/view-options-query-request';
import { WordListOptionsQueryRequest } from '../model/word-list-options-query-request';

export const INSTALLATION_LIST = {
  uno: new Startup(
    [
      new CorpusShort('susanne', 'susanne'),
      new CorpusShort('wikiita', 'wikiita')
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
      WORD,
      LEFT,
      3,
      false,
      false,
      FIRST,
      WORD,
      false,
      false,
      NODE
    ), new FreqOptionsQueryRequest(
      0,
      FIRST,
      WORD,
      false,
      NODE,
      0,
      false,
      []
    )
  )
  ,
  due: new Startup(
    [
      new CorpusShort('1', 'AcWac EU'),
      new CorpusShort('2', 'Brexit IT'),
      new CorpusShort(REPUBBLICA, 'Repubblica')
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
      WORD,
      LEFT,
      3,
      false,
      false,
      FIRST,
      WORD,
      false,
      false,
      NODE
    ), new FreqOptionsQueryRequest(
      0,
      FIRST,
      WORD,
      false,
      NODE,
      0,
      false,
      []
    )
  )

}
