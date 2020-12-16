import { Selection } from "./selection";

export class TextTypesRequest {
  freeTexts: Selection[] = [];
  singleSelects: Selection[] = [];
  multiSelects: Selection[] = [];
}