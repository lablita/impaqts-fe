import { Component, Input, OnInit } from '@angular/core';
import { KeyValueItem } from '../model/key-value-item';
import { Metadatum } from '../model/Metadatum';

@Component({
  selector: 'app-dispaly-panel-options',
  templateUrl: './dispaly-panel-options.component.html',
  styleUrls: ['./dispaly-panel-options.component.scss']
})
export class DispalyPanelOptionsComponent implements OnInit {

  @Input() isVisualQuery: boolean = false;
  @Input() selectedCorpus: KeyValueItem | null = null;
  @Input() metadataAttributes: KeyValueItem[] = [];
  @Input() textTypesAttributes: KeyValueItem[] = [];
  @Input() metadataTextTypes: Metadatum[] = [];

  public visualQueryOptionsLabel = '';
  public viewOptionsLabel = '';
  public titleOption?: KeyValueItem;
  public wordListOptionsLabel = '';
  public sortOptionsLabel = '';
  public freqOptionsLabel = '';
  public collocationOptionsLabel = '';
  public filterOptionsLabel = '';
  public displayPanelOptions = false;

  constructor() { }

  ngOnInit(): void {
  }

}
