import { Injectable } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';

export class CorpusAttributes {
  corpus: string;
  attributes: KeyValueItem[];

  constructor(corpus: string, attributes: KeyValueItem[]) {
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
          new KeyValueItem('OPTION_ATTR_URL_WORLD', CONCORDANCE_WORD),
          new KeyValueItem('OPTION_ATTR_URL_TAG', 'PAGE.CONCORDANCE.TAG'),
          new KeyValueItem('OPTION_ATTR_URL_LEMMA', CONCORDANCE_LEMMA),
          new KeyValueItem('OPTION_ATTR_URL_WORLD_LC', 'PAGE.CONCORDANCE.VIEW_OPTIONS.WORD_LC'),
          new KeyValueItem('OPTION_ATTR_URL_LEMMA_LC', 'PAGE.CONCORDANCE.VIEW_OPTIONS.LEMMA_LC')
        ]
      )
    ];

  constructor() { }

  public getAttributesByCorpus(corpus: string): KeyValueItem[] {
    const attributes = this.attributesByCorpus.find(ca => ca.corpus === corpus);
    return attributes ? attributes.attributes : [];
  }
}
