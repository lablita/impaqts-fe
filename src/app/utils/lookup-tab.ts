import { OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, OPTIONAL_DISPLAY_ATTR_URL_KWIC, REPUBBLICA } from '../model/constants';
import { Corpus } from '../model/dropdown-item';
import { Installation } from '../model/installation';
import { ViewOptionsQueryRequest } from '../model/view-options-query-request';
import { WordListOptionsQueryRequest } from '../model/word-list-options-query-request';

export const INSTALLATION_LIST = {
  uno: new Installation(
    [
      new Corpus('1', 'AcWac EU'),
      new Corpus('2', 'Brexit IT'),
      new Corpus('3', 'DeWac Small'),
      new Corpus('4', 'DeWac Complete'),
      new Corpus('5', 'FrWac Complete'),
      new Corpus('6', 'EPIC int_es_en'),
      new Corpus('7', 'ItWac Small'),
      new Corpus(REPUBBLICA, 'Repubblica')
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
    )
  )
  ,
  due: new Installation(
    [
      new Corpus('1', 'AcWac EU'),
      new Corpus('2', 'Brexit IT'),
      new Corpus(REPUBBLICA, 'Repubblica')
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
    )
  )

}
