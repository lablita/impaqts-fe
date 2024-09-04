import { FieldRequest } from 'src/app/model/field-request';
import { KWICline } from 'src/app/model/kwicline';

export class LastResult {
  public kwicLines: Array<KWICline> | undefined = undefined;
  public initialPagination = 0;
  public totalResults = 0;
  public first = 0;
  public fieldRequest: FieldRequest[] | undefined = undefined;

  constructor(
    kwicLines: Array<KWICline> | undefined,
    initialPagination = 0,
    totalResults = 0,
    first = 0,
    fieldRequest: FieldRequest[] | undefined = undefined
  ) {
    this.kwicLines = kwicLines;
    this.initialPagination = initialPagination;
    this.totalResults = totalResults;
    this.first = first;
    this.fieldRequest = fieldRequest;
  }
}
