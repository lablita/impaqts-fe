import { Injectable } from '@angular/core';
import { LookUpObject } from '../model/lookup-object';

export class CorpusAttributes {
  corpus: string;
  attributes: LookUpObject[];

  constructor(corpus: string, attributes: LookUpObject[]) {
    this.corpus = corpus;
    this.attributes = attributes;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ViewOptionsPanelService {

  private attributesByCorpus =
    [
      new CorpusAttributes('REPUBBLICA',
        [
          new LookUpObject('OPTION_ATTR_URL_WORLD', 'PAGE.CONCORDANCE.WORD'),
          new LookUpObject('OPTION_ATTR_URL_TAG', 'PAGE.CONCORDANCE.TAG'),
          new LookUpObject('OPTION_ATTR_URL_LEMMA', 'PAGE.CONCORDANCE.LEMMA'),
          new LookUpObject('OPTION_ATTR_URL_WORLD_LC', 'PAGE.CONCORDANCE.VIEW_OPTIONS.WORD_LC'),
          new LookUpObject('OPTION_ATTR_URL_LEMMA_LC', 'PAGE.CONCORDANCE.VIEW_OPTIONS.LEMMA_LC')
        ]
      )
    ];

  constructor() { }

  public getAttributesByCorpus(corpus: string): LookUpObject[] {
    const attributes = this.attributesByCorpus.find(ca => ca.corpus === corpus);
    return attributes ? attributes.attributes : [];
  }
}
