import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CorpusInfoObj } from '../model/corpus-info-obj';

@Component({
  selector: 'app-corpus-info',
  templateUrl: './corpus-info.component.html',
  styleUrls: ['./corpus-info.component.scss']
})
export class CorpusInfoComponent implements OnInit {

  public countsLabel: string;
  public counts: CorpusInfoObj[];
  public generalInfosLabel: string;
  public generalInfo: CorpusInfoObj[];
  public lexiconSizesLabel: string;
  public lexiconSizes: CorpusInfoObj[];
  public structArtLabel: string;
  public structArt: CorpusInfoObj[];


  constructor(
    private readonly translateService: TranslateService
  ) {
    this.countsLabel = 'PAGE.CORPUS_INFO.COUNTS';
    this.counts = [
      new CorpusInfoObj('PAGE.CONCORDANCE.TOKENS', '380,823,725'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.WORDS', '320,982,034'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.SENTENCES', '15,835,675'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.PARAGRAPHS', '0'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.DOCUMENTS', '572,515')
    ];

    this.generalInfosLabel = 'PAGE.CORPUS_INFO.GENERAL_INFO';
    this.generalInfo = [
      new CorpusInfoObj('PAGE.CORPUS_INFO.CORPUS_DESC', 'Document', '#'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.LANGUAGE', 'Italian'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.ENCODING', 'Latin1'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.COMPILED', '04/28/2016 14:54:16'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.TAGSET', 'Description', '#')
    ];

    this.lexiconSizesLabel = 'PAGE.CORPUS_INFO.LEXICON_SIZES';
    this.lexiconSizes = [
      new CorpusInfoObj('PAGE.CONCORDANCE.WORD', '1,383,319'),
      new CorpusInfoObj('PAGE.CONCORDANCE.TAG', '53'),
      new CorpusInfoObj('PAGE.CONCORDANCE.LEMMA', '965,977'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.LC', '1,138,924'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.LEMMA_LC', '866,034')
    ];

    this.structArtLabel = 'PAGE.CORPUS_INFO.STRUCT_ATTR';
    this.structArt = [
      new CorpusInfoObj('PAGE.CORPUS_INFO.SUBTITLE', '463,218'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.TITLE', '1,059,241'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.TEXT', '572,512'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.SUMMARY', '197,184'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.S', '15,835,675'),
      new CorpusInfoObj('PAGE.CORPUS_INFO.ARTICLE', '572,515')
    ];
  }

  ngOnInit(): void {


  }

}
