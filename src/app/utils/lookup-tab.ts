import { OPTIONAL_DISPLAY_ATTR_URL_FOR_EACH, OPTIONAL_DISPLAY_ATTR_URL_KWIC } from '../model/constants';
import { ViewOptionQueryRequest } from '../model/query-request';

export const CORPORA_LIST = {
  uno: new ViewOptionQueryRequest(
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
  ),
  due: new ViewOptionQueryRequest(
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
}
