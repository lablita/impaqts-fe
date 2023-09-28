import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CONCORDANCE_LEMMA, CONCORDANCE_WORD } from '../common/label-constants';
import { INSTALLATION } from '../model/constants';
import { CorpusInfo } from '../model/corpusinfo/corpus-info';
import { KeyValueItem } from '../model/key-value-item';
import { CorpusInfoService } from '../services/corpus-info.service';
import { CorpusSelectionService } from '../services/corpus-selection.service';
import { Subscription } from 'rxjs';
import { DisplayPanelService } from '../services/display-panel.service';
import { CORPUS_INFO } from '../common/routes-constants';

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
export class CorpusInfoComponent implements OnInit, OnDestroy {

  public countsLabel = '';
  public generalInfosLabel = '';
  public generalInfo: CorpusInfoObj[] = [];
  public lexiconSizesLabel = '';
  public lexiconSizes: CorpusInfoObj[] = [];
  public structArtLabel = '';
  public structArt: CorpusInfoObj[] = [];

  public corpusName: KeyValueItem | null = null;
  public corpusInfo: CorpusInfo | null = null;
  public corpusStructureTree: Array<TreeNode> = [];
  public noCorpusInfoToShow = false;
  private corpusSelectedSubscription?: Subscription;

  constructor(
    private readonly corpusInfoService: CorpusInfoService,
    private readonly corpusSelectionService: CorpusSelectionService,
    private readonly displayPanelService: DisplayPanelService
  ) { }

  ngOnInit(): void {
    this.displayPanelService.menuItemClickSubject.next(CORPUS_INFO);
    if (this.corpusSelectionService.getSelectedCorpus()) {
      this.corpusName = this.corpusSelectionService.getSelectedCorpus();
      this.retrieveCorpusInfo();
    } 

    this.corpusSelectedSubscription = this.corpusSelectionService.corpusSelectedSubject.subscribe(selectedCorpus => {
      this.corpusName = selectedCorpus;
      this.retrieveCorpusInfo();
    });

    this.countsLabel = 'PAGE.CORPUS_INFO.COUNTS';
  }

  ngOnDestroy(): void {
    if (this.corpusSelectedSubscription) {
      this.corpusSelectedSubscription.unsubscribe();
    }
  }

  private retrieveCorpusInfo(): void {
    if (this.corpusName && this.corpusName.value) {
      this.corpusInfoService.getCorpusInfo(this.corpusName.value).subscribe(corpusInfo => {
        this.corpusInfo = corpusInfo;
        if (this.corpusInfo) {
          this.corpusStructureTree = this.getTree(this.corpusInfo);
          this.noCorpusInfoToShow = false
        } else {
          this.noCorpusInfoToShow = true
        }
      }, err => this.noCorpusInfoToShow = true
      );
    }
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
