import { OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, OPTIONAL_DISPLAY_ATTR_URL_KWIC, REPUBBLICA } from '../model/constants';
import { Corpora } from '../model/corpora';
import { Corpus } from '../model/dropdown-item';
import { ViewOptionQueryRequest } from '../model/query-request';

export const CORPORA_LIST = {
  uno: new Corpora(
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
    new ViewOptionQueryRequest(
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
    )
  )
  ,
  due: new Corpora(
    [
      new Corpus('1', 'AcWac EU'),
      new Corpus('2', 'Brexit IT'),
      new Corpus(REPUBBLICA, 'Repubblica')
    ],
    new ViewOptionQueryRequest(
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
    )
  )

}
