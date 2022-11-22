import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CONCORDANCE_LEMMA, CONCORDANCE_WORD } from '../common/label-constants';
import { INSTALLATION } from '../model/constants';
import { CorpusInfo } from '../model/corpusinfo/corpus-info';
import { KeyValueItem } from '../model/key-value-item';
import { CorpusInfoService } from '../services/corpus-info.service';

class CorpusInfoObj {
  label: string;
  value: string;
  tag = '';
  constructor(label: string, value: string, tag?: string) {
    this.label = label;
    this.value = value;
    if (tag) {
      this.tag = tag;
    }
  }
}
@Component({
  selector: 'app-corpus-info',
  templateUrl: './corpus-info.component.html',
  styleUrls: ['./corpus-info.component.scss']
})
export class CorpusInfoComponent implements OnInit {

  public countsLabel = '';
  public counts: CorpusInfoObj[] = Array.from<CorpusInfoObj>({ length: 0 });
  public generalInfosLabel = '';
  public generalInfo: CorpusInfoObj[] = Array.from<CorpusInfoObj>({ length: 0 });
  public lexiconSizesLabel = '';
  public lexiconSizes: CorpusInfoObj[] = Array.from<CorpusInfoObj>({ length: 0 });
  public structArtLabel = '';
  public structArt: CorpusInfoObj[] = Array.from<CorpusInfoObj>({ length: 0 });

  public corpusName: KeyValueItem | null = null;
  public corpusInfo: CorpusInfo | null = null;
  public corpusStructureTree: Array<TreeNode> = [];

  constructor(
    private readonly corpusInfoService: CorpusInfoService
  ) { }

  ngOnInit(): void {
    const selectedCorpus = localStorage.getItem('selectedCorpus');
    const inst = localStorage.getItem(INSTALLATION);
    if (inst && selectedCorpus) {
      this.corpusName = JSON.parse(selectedCorpus);
      const installation = JSON.parse(inst);
      if (this.corpusName && this.corpusName.value) {
        this.corpusInfoService.getCorpusInfo(installation, this.corpusName.value).subscribe(corpusInfo => {
          this.corpusInfo = corpusInfo;
          if (this.corpusInfo) {
            this.corpusStructureTree = this.getTree(this.corpusInfo);
          }
        });
      }
    }

    // this.displayPanelService.panelSelectedSubject.next(CORPUS_INFO);
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
      new CorpusInfoObj(CONCORDANCE_WORD, '1,383,319'),
      new CorpusInfoObj('PAGE.CONCORDANCE.TAG', '53'),
      new CorpusInfoObj(CONCORDANCE_LEMMA, '965,977'),
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

  private getTree(corpusInfo: CorpusInfo): Array<TreeNode> {
    return corpusInfo.structs.map(sInfo => {
      const tn = {} as TreeNode;
      tn.leaf = false;
      tn.data = sInfo;
      tn.children = sInfo.structItems.sort((sItem1, sItem2) => sItem1.name > sItem2.name ? 1 : -1).map(sItem => {
        const tnItem = {} as TreeNode;
        tnItem.data = sItem;
        tnItem.leaf = true;
        tnItem.parent = tn;
        return tnItem;
      });
      return tn;
    });
  }

}
