import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ConcordanceService } from '../concordance/concordance.service';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';
import { Selection } from '../model/selection';
import { TextTypesRequest } from '../model/text-types-request';
import { MetadataUtilService } from '../utils/metadata-util.service';

const TEXT_TYPES_QUERY_REQUEST = 'textTypesQueryRequest';
export class subMetadatum {
  currentSize: number;
  kwicLines: string[];
  inProgress: boolean;
  metadataValues: string[];
}

@Component({
  selector: 'app-metadata-panel',
  templateUrl: './metadata-panel.component.html',
  styleUrls: ['./metadata-panel.component.scss']
})
export class MetadataPanelComponent implements OnInit {

  @Input() public metadata: Metadatum[];
  @Input() public corpus: string;
  @Input() public title: string;
  @Output() public closeSidebarEvent = new EventEmitter<boolean>();

  public simple: string;
  public res: KeyValueItem[] = [];
  public displayPanelMetadata = false;
  public selected: any;
  public loading = 0;

  private textTypesRequest: TextTypesRequest;

  constructor(
    private readonly concordanceService: ConcordanceService,
    private readonly metadataUtilService: MetadataUtilService
  ) { }

  ngOnInit(): void {

    this.loading = this.metadata.length;


    // recuro i dati salvati nel localstorage
    this.textTypesRequest = localStorage.getItem(TEXT_TYPES_QUERY_REQUEST) ?
      JSON.parse(localStorage.getItem(TEXT_TYPES_QUERY_REQUEST)) : null;

    // genero albero per componente multiselect check box
    this.metadata.forEach(md => {
      if ((md.subMetadata?.length >= 0) && !md.freeText) {
        md.tree = [];
        const res = this.metadataUtilService.generateTree(md, (this.textTypesRequest?.multiSelects &&
          this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name).length > 0)
          ? this.textTypesRequest.multiSelects.filter(ms => ms.key === md.name)[0].values : null);
        md.tree.push(res['tree']);
        md.selection = res['selections'];
      }
    });

    // genero albero flat per componente multiselect check box e single select
    this.loading = this.metadata.length;
    this.metadata.forEach((metadatum, index) => {
      this.res.push(new KeyValueItem(metadatum.name, ''));
      if (metadatum.retrieveValuesFromCorpus) {
        metadatum.selected = false;
        setTimeout(() => this.concordanceService.getMetadatumValues(this.corpus, metadatum.name).subscribe(res => {
          //ripristino valori letti da local storage 
          const selectionated = this.textTypesRequest?.singleSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
            this.textTypesRequest.singleSelects.filter(ss => ss.key === metadatum.name)[0] :
            (this.textTypesRequest?.multiSelects.filter(ss => ss.key === metadatum.name).length > 0 ?
              this.textTypesRequest.multiSelects.filter(ss => ss.key === metadatum.name)[0] : null);
          this.loading--;

          metadatum = this.metadataUtilService.mergeMetedata(res, metadatum, selectionated);

          if (this.loading === 0) {
            //collego l'elenco dei metadati recuperato dal corpus e lo collegao al ramo cui spetta
            this.metadataUtilService.linkLeafs(this.metadata, this.textTypesRequest);
            // elimino metadata che partecimano ad alberi 
            this.metadata = this.metadata.filter(md => !md.child);
            this.metadata.forEach(md => {
              if (!md.multipleChoice && !md.freeText) {
                this.metadataUtilService.setUnselectable(md.tree[0]);
              };
            });
          }
        }), 4000 * index);
      } else {
        this.loading--;
      }
    });

    /** recupero freeText da localstorage */
    if (this.textTypesRequest?.freeTexts) {
      this.metadata.forEach(md => {
        if (md?.freeText) {
          md.selection = this.textTypesRequest.freeTexts.filter(freeT => freeT.key === md.name)[0]?.value;
        }
      });
    }
    //ordinamento position 
    this.metadata.sort((a, b) => a.position - b.position);
  }

  public closeSidebar(): void {
    this.closeSidebarEvent.emit(true);
  }

  public clickMakeConcordance() {
    this.textTypesRequest = new TextTypesRequest();
    this.metadata.forEach(md => {
      if (!!md.selection) {
        if (md.freeText) {
          //freetxt
          this.textTypesRequest.freeTexts.push(new Selection(md.name, md.selection as string));
        } else if (!md.multipleChoice && (md?.tree[0]?.children.length > 0)) {
          //single
          this.textTypesRequest.singleSelects.push(new Selection(md.name, (md.selection as TreeNode).label));
        } else {
          //multi
          const values: string[] = [];
          (md.selection as TreeNode[]).forEach(m => {
            values.push(m.label);
          });
          this.textTypesRequest.multiSelects.push(new Selection(md.name, null, values));
        }
      }
    });
    localStorage.setItem(TEXT_TYPES_QUERY_REQUEST, JSON.stringify(this.textTypesRequest));
    console.log('ok');
  }

  public isFilterOptions(): boolean {
    return this.title === 'MENU.FILTER';
  }

  public nodeSelect(event: any): void {
    console.log('');
  }

}
