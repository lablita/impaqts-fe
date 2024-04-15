export class ViewOptionsQueryRequest {
  attributes: string[];

  constructor(
    attributes: string[],
  ) {
    this.attributes = attributes;
  }

  public static getInstance(): ViewOptionsQueryRequest {
    return new ViewOptionsQueryRequest([]);
  }
}

export const DEFAULT_VIEW_OPTIONS_QUERY_REQUEST = new ViewOptionsQueryRequest([]);

